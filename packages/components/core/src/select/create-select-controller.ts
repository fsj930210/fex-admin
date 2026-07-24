import type { SelectionValue } from '../selection/types'
import { createStore } from '../store/create-store'
import type {
  SelectController,
  SelectControllerOptions,
  SelectOption,
  SelectSnapshot,
} from './types'

function enabledOptions<TValue extends SelectionValue>(options: SelectControllerOptions<TValue>) {
  return (options.options ?? []).filter(
    (option) => !option.disabled && !options.selection.isDisabled(option.value),
  )
}

export function createSelectController<TValue extends SelectionValue>(
  options: SelectControllerOptions<TValue>,
): SelectController<TValue> {
  const isOpenControlled = () => options.open !== undefined
  const isSearchControlled = () => options.searchValue !== undefined
  const initialSnapshot: SelectSnapshot<TValue> = {
    open: options.open ?? options.defaultOpen ?? false,
    searchValue: options.searchValue ?? options.defaultSearchValue ?? '',
    activeValue: undefined,
    interaction: null,
    selectedValues: options.selection.getSnapshot().values,
  }
  const store = createStore(initialSnapshot)
  let resolvedSource = initialSnapshot
  let resolvedSnapshot = initialSnapshot

  function snapshot(): SelectSnapshot<TValue> {
    const current = store.getSnapshot()
    const open = options.open ?? current.open
    const searchValue = options.searchValue ?? current.searchValue
    const selectedValues = options.selection.getSnapshot().values
    if (
      current === resolvedSource &&
      open === resolvedSnapshot.open &&
      searchValue === resolvedSnapshot.searchValue &&
      selectedValues === resolvedSnapshot.selectedValues
    ) {
      return resolvedSnapshot
    }
    resolvedSource = current
    if (
      open === current.open &&
      searchValue === current.searchValue &&
      selectedValues === current.selectedValues
    ) {
      resolvedSnapshot = current
      return current
    }
    resolvedSnapshot = {
      ...current,
      open,
      searchValue,
      selectedValues,
    }
    return resolvedSnapshot
  }

  function update(patch: Partial<SelectSnapshot<TValue>>) {
    store.updateSnapshot((current) => ({ ...current, ...patch }))
  }

  function setOpen(open: boolean) {
    if (snapshot().open === open) return
    if (!isOpenControlled()) update({ open })
    options.onOpenChange?.(open)
  }

  function clearSearchAfterSelection() {
    if (snapshot().searchValue === '') return
    if (isSearchControlled()) options.onSearch?.('')
    else update({ searchValue: '' })
  }

  function findOption(value: TValue | undefined): SelectOption<TValue> | undefined {
    return value === undefined
      ? undefined
      : options.options?.find((option) => option.value === value)
  }

  const controller: SelectController<TValue> = {
    selection: options.selection,
    getSnapshot: snapshot,
    subscribe: (listener) => {
      const unsubscribeStore = store.subscribe(listener)
      const unsubscribeSelection = options.selection.subscribe(listener)
      return () => {
        unsubscribeStore()
        unsubscribeSelection()
      }
    },
    open: () => setOpen(true),
    close: () => {
      setOpen(false)
      update({ activeValue: undefined, interaction: null })
    },
    toggleOpen: () => setOpen(!snapshot().open),
    setSearchValue: (keyword) => {
      if (snapshot().searchValue === keyword) return
      if (!isSearchControlled()) update({ searchValue: keyword })
      options.onSearch?.(keyword)
    },
    setActiveValue: (value, interaction = 'pointer') => {
      const option = findOption(value)
      if (
        value !== undefined &&
        (!option || option.disabled || options.selection.isDisabled(value))
      )
        return
      update({ activeValue: value, interaction })
    },
    moveActive: (direction) => {
      const items = enabledOptions(options)
      if (!items.length) return
      const currentIndex = items.findIndex((option) => option.value === snapshot().activeValue)
      let nextIndex =
        currentIndex < 0 ? (direction === 1 ? 0 : items.length - 1) : currentIndex + direction
      if (options.loop !== false) nextIndex = (nextIndex + items.length) % items.length
      else nextIndex = Math.min(items.length - 1, Math.max(0, nextIndex))
      controller.setActiveValue(items[nextIndex]?.value, 'keyboard')
    },
    moveActiveTo: (position) => {
      const items = enabledOptions(options)
      controller.setActiveValue(
        position === 'first' ? items[0]?.value : items.at(-1)?.value,
        'keyboard',
      )
    },
    selectValue: (value) => {
      const option = findOption(value)
      if (!option || option.disabled || options.selection.isDisabled(value)) return
      const multiple = options.multiple === true || options.mode === 'tags'
      if (multiple) {
        const selected = options.selection.isSelected(value)
        if (
          !selected &&
          options.maxCount !== undefined &&
          options.selection.getSnapshot().values.length >= options.maxCount
        )
          return
        options.selection.toggle(value)
      } else {
        options.selection.replace(value)
        controller.close()
      }
      clearSearchAfterSelection()
    },
    selectActive: () => {
      const value = snapshot().activeValue
      if (value === undefined) return false
      controller.selectValue(value)
      return true
    },
    createTag: (keyword = snapshot().searchValue) => {
      if (options.mode !== 'tags') return false
      const value = keyword.trim()
      if (!value || options.onTagCreate?.(value) === false) return false
      if (
        !options.selection.isSelected(value) &&
        options.maxCount !== undefined &&
        options.selection.getSnapshot().values.length >= options.maxCount
      )
        return false
      if (!options.selection.isSelected(value)) options.selection.select(value)
      clearSearchAfterSelection()
      return true
    },
    removeLastSelected: () => {
      const values = options.selection.getSnapshot().values
      const value = [...values].reverse().find((item) => !options.selection.isDisabled(item))
      if (value !== undefined) options.selection.unselect(value)
    },
    clear: () => {
      options.selection.clear()
      controller.setSearchValue('')
    },
  }
  return controller
}
