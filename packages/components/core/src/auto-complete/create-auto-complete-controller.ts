import { createStore } from '../store/create-store'
import { filterAutoCompleteItems, resolveAutoCompleteItems } from './items'
import type {
  AutoCompleteController,
  AutoCompleteControllerOptions,
  AutoCompleteInteraction,
  AutoCompleteKey,
  AutoCompleteSnapshot,
} from './types'

export function createAutoCompleteController<TItem>(
  options: AutoCompleteControllerOptions<TItem>,
): AutoCompleteController<TItem> {
  const store = createStore<AutoCompleteSnapshot>({
    value: options.value ?? options.defaultValue ?? '',
    open: options.open ?? options.defaultOpen ?? false,
    activeKey: undefined,
    interaction: null,
  })
  let cachedSource = store.getSnapshot()
  let cachedSnapshot = cachedSource
  const snapshot = () => {
    const current = store.getSnapshot()
    const value = options.value ?? current.value
    const open = options.open ?? current.open
    if (current === cachedSource && value === cachedSnapshot.value && open === cachedSnapshot.open)
      return cachedSnapshot
    cachedSource = current
    cachedSnapshot = value === current.value && open === current.open ? current : { ...current, value, open }
    return cachedSnapshot
  }
  const update = (patch: Partial<AutoCompleteSnapshot>) =>
    store.updateSnapshot((current) => ({ ...current, ...patch }))
  const visibleItems = () =>
    filterAutoCompleteItems(resolveAutoCompleteItems(options), snapshot().value, options.filterOption)
  const setActiveKey = (
    key: AutoCompleteKey | undefined,
    interaction: Exclude<AutoCompleteInteraction, null> = 'pointer',
  ) => {
    const entry = visibleItems().find((item) => item.key === key)
    if (key !== undefined && (!entry || entry.disabled)) return
    update({ activeKey: key, interaction })
  }
  const setOpen: AutoCompleteController<TItem>['setOpen'] = (
    open,
    reason = 'programmatic',
  ) => {
    if (snapshot().open === open) return
    if (options.open === undefined) update({ open })
    if (!open) update({ activeKey: undefined, interaction: null })
    options.onOpenChange?.(open, { reason })
  }
  const setValue: AutoCompleteController<TItem>['setValue'] = (value, reason = 'input') => {
    const previousValue = snapshot().value
    if (value === previousValue && reason !== 'clear') return
    if (options.value === undefined) update({ value, activeKey: undefined, interaction: null })
    options.onChange?.(value, { reason, previousValue })
    options.onSearch?.(value, { reason, previousValue })
    if (reason === 'clear') options.onClear?.({ previousValue })
  }
  const controller: AutoCompleteController<TItem> = {
    getSnapshot: snapshot,
    subscribe: store.subscribe,
    getVisibleItems: visibleItems,
    setValue,
    setOpen,
    setActiveKey,
    moveActive: (direction) => {
      const items = visibleItems().filter((item) => !item.disabled)
      if (!items.length) return
      const current = items.findIndex((item) => item.key === snapshot().activeKey)
      let next = current < 0 ? (direction > 0 ? 0 : items.length - 1) : current + direction
      next = options.loop === false
        ? Math.max(0, Math.min(items.length - 1, next))
        : (next + items.length) % items.length
      setActiveKey(items[next]?.key, 'keyboard')
    },
    selectItem: (key) => {
      const entry = visibleItems().find((item) => item.key === key)
      if (!entry || entry.disabled) return false
      const previousValue = snapshot().value
      if (options.value === undefined)
        update({ value: entry.value, activeKey: undefined, interaction: null })
      options.onChange?.(entry.value, {
        reason: 'select',
        previousValue,
        selectedItem: entry.item,
        selectedKey: entry.key,
      })
      options.onSelect?.(entry.value, {
        previousValue,
        selectedItem: entry.item,
        selectedKey: entry.key,
      })
      if (options.closeOnSelect !== false) setOpen(false, 'select')
      return true
    },
    selectActive: () => {
      const key = snapshot().activeKey
      return key === undefined ? false : controller.selectItem(key)
    },
    clear: () => setValue('', 'clear'),
  }
  return controller
}
