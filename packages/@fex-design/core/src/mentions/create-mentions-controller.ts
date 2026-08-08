import { createStore } from '../store/create-store'
import { normalizeMentionsPrefixes, parseMentionsQuery } from './query'
import { replaceMentionsQuery } from './replace-query'
import { createMentionsRegistry } from './registry'
import type {
  MentionsController,
  MentionsControllerConfig,
  MentionsKey,
  MentionsOpenReason,
  MentionsQuery,
  MentionsRegisteredItem,
  MentionsSelection,
  MentionsSnapshot,
} from './types'

export function createMentionsController<TData = unknown>(
  config: MentionsControllerConfig<TData> = {},
): MentionsController<TData> {
  function valueWithReplacement(value: string, query: MentionsQuery, itemValue: string) {
    return replaceMentionsQuery({
      value,
      query,
      text: query.prefix + itemValue,
    }).value
  }

  const store = createStore<MentionsSnapshot>({
    value: config.value ?? config.defaultValue ?? '',
    open: config.open ?? config.defaultOpen ?? false,
    query: null,
    activeKey: undefined,
    interaction: null,
  })
  const registry = createMentionsRegistry<TData>()
  let lastSearchKey = ''
  let cachedStoreSnapshot = store.getSnapshot()
  let cachedValue = cachedStoreSnapshot.value
  let cachedOpen = cachedStoreSnapshot.open
  let cachedSnapshot = cachedStoreSnapshot

  function snapshot(): MentionsSnapshot {
    const current = store.getSnapshot()
    const value = config.value ?? current.value
    const open = config.open ?? current.open
    if (value === current.value && open === current.open) return current
    if (current === cachedStoreSnapshot && value === cachedValue && open === cachedOpen) {
      return cachedSnapshot
    }
    cachedStoreSnapshot = current
    cachedValue = value
    cachedOpen = open
    cachedSnapshot = { ...current, value, open }
    return cachedSnapshot
  }

  function update(patch: Partial<MentionsSnapshot>) {
    store.updateSnapshot((current) => {
      const next = { ...current, ...patch }
      return Object.keys(patch).every((key) =>
        Object.is(
          current[key as keyof MentionsSnapshot],
          next[key as keyof MentionsSnapshot],
        ),
      )
        ? current
        : next
    })
  }

  function resolveQuery(value: string, selection: MentionsSelection): MentionsQuery | null {
    const prefixes = normalizeMentionsPrefixes(config.prefixes)
    const parser = config.parseQuery ?? parseMentionsQuery
    return parser({
      value,
      selectionStart: selection.start,
      selectionEnd: selection.end,
      prefixes,
    })
  }

  function emitSearch(query: MentionsQuery | null) {
    const key = query ? query.prefix + '\n' + query.text + '\n' + query.start + '\n' + query.end : ''
    if (!query || key === lastSearchKey) return
    lastSearchKey = key
    config.onSearch?.(query.text, { prefix: query.prefix, query })
  }

  function setOpen(open: boolean, reason: MentionsOpenReason = 'programmatic') {
    if (snapshot().open === open) return
    if (config.open === undefined) update({ open })
    if (!open) update({ interaction: null })
    config.onOpenChange?.(open, { reason })
  }

  function syncQuery(value: string, selection: MentionsSelection, reason: MentionsOpenReason) {
    const query = resolveQuery(value, selection)
    const activeKey =
      query === null
        ? undefined
        : snapshot().activeKey ??
          registry.getItems().find((item) => item.value === query.text)?.key ??
          firstEnabledKey()
    update({ query, activeKey })
    if (query) {
      setOpen(true, reason)
      emitSearch(query)
    } else {
      setOpen(false, reason)
    }
  }

  function firstEnabledKey() {
    return registry.getEnabledItems()[0]?.key
  }

  const controller: MentionsController<TData> = {
    getSnapshot: snapshot,
    subscribe: store.subscribe,
    setValue: (value, selection, reason = 'input') => {
      const previousValue = snapshot().value
      if (config.value === undefined) update({ value })
      if (value !== previousValue) config.onChange?.(value, { reason })
      syncQuery(value, selection, 'input')
    },
    setSelection: (selection, reason = 'selection') => syncQuery(snapshot().value, selection, reason),
    setOpen,
    registerItem: (item) => {
      const unregister = registry.register(item)
      if (snapshot().open && snapshot().activeKey === undefined) {
        update({ activeKey: firstEnabledKey() })
      }
      return unregister
    },
    getItems: registry.getItems,
    setActiveKey: (key, interaction = 'pointer') => {
      const item = key === undefined ? undefined : registry.getItem(key)
      if (key !== undefined && (!item || item.disabled)) return
      update({ activeKey: key, interaction })
    },
    moveActive: (direction) => {
      const items = registry.getEnabledItems()
      if (!items.length) return
      const currentIndex = items.findIndex((item) => item.key === snapshot().activeKey)
      const nextIndex =
        currentIndex < 0
          ? direction > 0
            ? 0
            : items.length - 1
          : (currentIndex + direction + items.length) % items.length
      controller.setActiveKey(items[nextIndex]?.key, 'keyboard')
    },
    selectItem: (key: MentionsKey) => {
      const item = registry.getItem(key)
      const query = snapshot().query
      if (!item || item.disabled || !query) return false
      const selectMeta = {
        prefix: query.prefix,
        text: query.text,
        query,
      }
      const nextValue = valueWithReplacement(snapshot().value, query, item.value)
      if (config.value === undefined) update({ value: nextValue })
      if (nextValue !== snapshot().value) {
        config.onChange?.(nextValue, { reason: 'input' })
      }
      update({ query: null, activeKey: key, interaction: null })
      config.onSelect?.(item as MentionsRegisteredItem<TData>, selectMeta)
      setOpen(false, 'select')
      return true
    },
    selectActive: () => {
      const key = snapshot().activeKey
      return key === undefined ? false : controller.selectItem(key)
    },
  }

  return controller
}
