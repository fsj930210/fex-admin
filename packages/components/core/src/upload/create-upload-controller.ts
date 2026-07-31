import { createStore } from '../store/create-store'
import { createUploadFeatureRuntime } from './create-feature-runtime'
import type { UploadFeatureContext } from './feature-types'
import {
  UPLOAD_IGNORE,
  type UploadController,
  type UploadId,
  type UploadItem,
  type UploadOptions,
  type UploadSnapshot,
} from './types'

let fallbackId = 0
const createId = () => globalThis.crypto?.randomUUID?.() ?? `upload-${Date.now()}-${fallbackId++}`

export function createUploadController<TResponse = unknown>(
  initialOptions: UploadOptions<TResponse> = {},
): UploadController<TResponse> {
  let options = initialOptions
  const initialItems = initialOptions.items ?? initialOptions.defaultItems ?? []
  const store = createStore<UploadSnapshot<TResponse>>({ items: [...initialItems] })
  const itemListeners = new Map<UploadId, Set<() => void>>()
  const itemsListeners = new Set<() => void>()
  const featureListeners = new Map<string, Map<UploadId, Set<() => void>>>()
  const removeHandlers = new Set<(id: UploadId) => void>()
  const destroyHandlers = new Set<() => void>()
  let runtime: ReturnType<typeof createUploadFeatureRuntime<TResponse>>

  const getItems = () => store.getSnapshot().items
  const getItem = (id: UploadId) => getItems().find((item) => item.id === id)

  function commit(
    items: readonly UploadItem<TResponse>[],
    changedIds: readonly UploadId[],
    structureChanged = false,
  ) {
    store.setSnapshot({ items })
    if (structureChanged) for (const listener of itemsListeners) listener()
    for (const id of changedIds) for (const listener of itemListeners.get(id) ?? []) listener()
    options.onItemsChange?.(items)
  }

  function updateItem(id: UploadId, patch: Partial<UploadItem<TResponse>>) {
    const current = getItem(id)
    if (!current) return undefined
    const next = { ...current, ...patch }
    commit(
      getItems().map((item) => (item.id === id ? next : item)),
      [id],
    )
    return next
  }

  async function addFiles(files: readonly File[]) {
    if (options.disabled) return
    const available = Math.max(
      0,
      (options.maxCount ?? Number.POSITIVE_INFINITY) - getItems().length,
    )
    const accepted = files.slice(0, available)
    for (const file of files.slice(available))
      options.onReject?.(file, new Error('Maximum file count exceeded.'))

    for (const file of accepted) {
      let item: UploadItem<TResponse> = {
        id: createId(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'pending',
      }
      let result
      try {
        result = await options.beforeUpload?.(file, { item, items: getItems(), batch: files })
      } catch (error) {
        item = { ...item, status: 'error', error, errorStage: 'before-upload' }
        commit([...getItems(), item], [item.id], true)
        options.onReject?.(file, error)
        continue
      }
      if (result === UPLOAD_IGNORE) {
        options.onReject?.(file, UPLOAD_IGNORE)
        continue
      }
      if (result === false) {
        item = { ...item, status: 'error', error: false, errorStage: 'before-upload' }
        commit([...getItems(), item], [item.id], true)
        options.onReject?.(file, false)
        continue
      }
      if (result instanceof Blob) {
        const nextFile =
          result instanceof File
            ? result
            : new File([result], file.name, {
                type: result.type || file.type,
                lastModified: file.lastModified,
              })
        item = {
          ...item,
          file: nextFile,
          name: nextFile.name,
          size: nextFile.size,
          type: nextFile.type,
        }
      }
      commit([...getItems(), item], [item.id], true)
      if (options.autoUpload !== false)
        await runtime.get<import('./types').UploadFeatureApi>('upload')?.start(item.id)
    }
  }

  async function remove(id: UploadId) {
    const item = getItem(id)
    if (!item) return false
    try {
      if ((await options.beforeRemove?.(item)) === false) return false
    } catch {
      return false
    }
    for (const handler of removeHandlers) handler(id)
    commit(
      getItems().filter((entry) => entry.id !== id),
      [id],
      true,
    )
    return true
  }

  async function clear() {
    const ids = getItems().map((item) => item.id)
    for (const id of ids) await remove(id)
  }

  const featureContext: UploadFeatureContext<TResponse> = {
    getSnapshot: store.getSnapshot,
    getOptions: () => options,
    getItem,
    getItems,
    updateItem,
    addFiles,
    getFeature: (id) => runtime.get(id),
    notifyFeatureItem(featureId, id) {
      for (const listener of featureListeners.get(featureId)?.get(id) ?? []) listener()
    },
    subscribeFeatureItem(featureId, id, listener) {
      const byItem = featureListeners.get(featureId) ?? new Map()
      const listeners = byItem.get(id) ?? new Set()
      listeners.add(listener)
      byItem.set(id, listeners)
      featureListeners.set(featureId, byItem)
      return () => listeners.delete(listener)
    },
    onRemove(handler) {
      removeHandlers.add(handler)
      return () => removeHandlers.delete(handler)
    },
    onDestroy(handler) {
      destroyHandlers.add(handler)
      return () => destroyHandlers.delete(handler)
    },
  }

  runtime = createUploadFeatureRuntime(featureContext)
  runtime.installAll(initialOptions.features ?? [])

  return {
    getSnapshot: store.getSnapshot,
    subscribe: store.subscribe,
    subscribeItems(listener) {
      itemsListeners.add(listener)
      return () => itemsListeners.delete(listener)
    },
    subscribeItem(id, listener) {
      const listeners = itemListeners.get(id) ?? new Set()
      listeners.add(listener)
      itemListeners.set(id, listeners)
      return () => listeners.delete(listener)
    },
    subscribeFeatureItem: featureContext.subscribeFeatureItem,
    updateOptions(next) {
      options = { ...options, ...next }
      if (next.items && next.items !== getItems()) {
        store.setSnapshot({ items: next.items })
        for (const listener of itemsListeners) listener()
        for (const item of next.items)
          for (const listener of itemListeners.get(item.id) ?? []) listener()
      }
    },
    getOptions: () => options,
    addFiles,
    remove,
    clear,
    getItem,
    getItems,
    hasFeature: runtime.has,
    getFeature: runtime.get,
    destroy() {
      for (const handler of destroyHandlers) handler()
    },
  }
}
