import { createStore } from '../store/create-store'
import type {
  BuiltinToastVariant,
  ToastConfig,
  ToastInput,
  ToastItem,
  ToastManager,
  ToastOptions,
  ToastSnapshot,
} from './types'

export type { BuiltinToastVariant, ToastConfig, ToastInput, ToastItem, ToastManager, ToastOptions, ToastPlacement, ToastSnapshot } from './types'

const defaultConfig: ToastConfig = {
  duration: 3000,
  max: 5,
  placement: 'top',
}

let nextToastId = 1

function createToastId() {
  const id = nextToastId
  nextToastId += 1
  return `fex-toast-${id}`
}

function isToastOptions<TContent>(input: ToastInput<TContent>): input is ToastOptions<TContent> {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return false
  }

  const record = input as Record<string, unknown>
  return (
    'id' in record ||
    'variant' in record ||
    'title' in record ||
    'description' in record ||
    'icon' in record ||
    'action' in record ||
    'placement' in record ||
    'duration' in record ||
    'closable' in record
  )
}

function normalizeInput<TContent>(
  input: ToastInput<TContent>,
  variant: BuiltinToastVariant | string,
  config: ToastConfig,
): ToastOptions<TContent> {
  if (isToastOptions(input)) {
    return {
      ...input,
      variant: input.variant ?? variant,
    }
  }

  return {
    title: input,
    variant,
    duration: config.duration,
  }
}

export function createToastManager<TContent = unknown>(initialConfig: Partial<ToastConfig> = {}): ToastManager<TContent> {
  const timers = new Map<string, ReturnType<typeof setTimeout>>()
  const store = createStore<ToastSnapshot<TContent>>({
    config: { ...defaultConfig, ...initialConfig },
    items: [],
  })

  function clearTimer(id: string) {
    const timer = timers.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.delete(id)
    }
  }

  function startTimer(id: string, duration: number) {
    clearTimer(id)
    if (duration < 0) {
      return
    }
    timers.set(id, setTimeout(() => dismiss(id), duration))
  }

  function applyLimit(items: ToastItem<TContent>[], max: number) {
    if (max < 0 || items.length <= max) {
      return items
    }

    const overflow = items.length - max
    for (const item of items.slice(0, overflow)) {
      clearTimer(item.id)
    }
    return items.slice(overflow)
  }

  function upsert(input: ToastInput<TContent>, fallbackVariant: BuiltinToastVariant | string) {
    const snapshot = store.getSnapshot()
    const options = normalizeInput(input, fallbackVariant, snapshot.config)
    const id = options.id ?? createToastId()
    const duration = options.duration ?? snapshot.config.duration
    const now = Date.now()
    let shouldStartTimer = false

    store.updateSnapshot((current) => {
      const existingIndex = current.items.findIndex((item) => item.id === id)
      const nextItem: ToastItem<TContent> = {
        action: options.action,
        closable: options.closable ?? true,
        createdAt: existingIndex >= 0 ? current.items[existingIndex]?.createdAt ?? now : now,
        description: options.description,
        duration,
        icon: options.icon,
        id,
        paused: false,
        placement: options.placement ?? current.config.placement,
        remaining: duration,
        startedAt: now,
        title: options.title,
        variant: options.variant ?? fallbackVariant,
      }

      shouldStartTimer = duration >= 0

      if (existingIndex >= 0) {
        const nextItems = current.items.slice()
        nextItems[existingIndex] = nextItem
        return { ...current, items: nextItems }
      }

      return {
        ...current,
        items: applyLimit([...current.items, nextItem], current.config.max),
      }
    })

    const itemExists = store.getSnapshot().items.some((item) => item.id === id)
    if (shouldStartTimer && itemExists) {
      startTimer(id, duration)
    } else {
      clearTimer(id)
    }

    return id
  }

  function dismiss(id?: string) {
    if (!id) {
      clear()
      return
    }
    remove(id)
  }

  function remove(id?: string) {
    if (!id) {
      clear()
      return
    }
    clearTimer(id)
    store.updateSnapshot((snapshot) => ({
      ...snapshot,
      items: snapshot.items.filter((item) => item.id !== id),
    }))
  }

  function clear() {
    for (const id of timers.keys()) {
      clearTimer(id)
    }
    store.updateSnapshot((snapshot) => ({ ...snapshot, items: [] }))
  }

  return {
    clear,
    configure(config) {
      store.updateSnapshot((snapshot) => {
        const nextConfig = { ...snapshot.config, ...config }
        return {
          config: nextConfig,
          items: applyLimit(snapshot.items, nextConfig.max),
        }
      })
    },
    dismiss,
    destroy: dismiss,
    error: (input) => upsert(input, 'error'),
    getSnapshot: store.getSnapshot,
    info: (input) => upsert(input, 'info'),
    loading: (input) => upsert(input, 'loading'),
    pause(id) {
      const item = store.getSnapshot().items.find((current) => current.id === id)
      if (!item || item.paused || item.duration < 0) {
        return
      }
      clearTimer(id)
      const remaining = Math.max(0, item.remaining - (Date.now() - item.startedAt))
      store.updateSnapshot((snapshot) => ({
        ...snapshot,
        items: snapshot.items.map((current) => current.id === id ? { ...current, paused: true, remaining } : current),
      }))
    },
    remove,
    resume(id) {
      const item = store.getSnapshot().items.find((current) => current.id === id)
      if (!item || !item.paused || item.duration < 0) {
        return
      }
      const startedAt = Date.now()
      store.updateSnapshot((snapshot) => ({
        ...snapshot,
        items: snapshot.items.map((current) => current.id === id ? { ...current, paused: false, startedAt } : current),
      }))
      startTimer(id, item.remaining)
    },
    show: (input) => upsert(input, 'default'),
    subscribe: store.subscribe,
    success: (input) => upsert(input, 'success'),
    update(id, options) {
      const current = store.getSnapshot().items.find((item) => item.id === id)
      if (!current) {
        return
      }
      upsert({ ...current, ...options, id }, options.variant ?? current.variant)
    },
    warning: (input) => upsert(input, 'warning'),
  }
}
