import { createSelectionController } from '@fex/components-core/selection/create-selection-controller'
import type { SelectionValue } from '@fex/components-core/selection/types'
import {
  createContext,
  createMemo,
  type JSX,
  type ParentProps,
  splitProps,
  useContext,
} from 'solid-js'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'

type ListboxOrientation = 'vertical' | 'horizontal'

type ListboxContextValue = {
  orientation: ListboxOrientation
  selectedValues: () => readonly SelectionValue[]
  isSelected: (value: SelectionValue) => boolean
  isDisabled: (value: SelectionValue) => boolean
  selectItem: (value: SelectionValue) => void
}

const ListboxContext = createContext<ListboxContextValue>()

function useListboxContext(component: string) {
  const context = useContext(ListboxContext)
  if (!context) {
    throw new Error(`${component} must be used inside ListboxRoot.`)
  }
  return context
}

type ListboxChangeMeta<TItem> = {
  selectedItem?: TItem | undefined
  selectedItems: TItem[]
  selectedValues: SelectionValue[]
  previousSelectedValues: SelectionValue[]
  changedValues: SelectionValue[]
}

type ListboxRootBaseProps<TItem> = ParentProps<
  Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
    items?: readonly TItem[]
    getItemValue?: (item: TItem) => SelectionValue
    getItemDisabled?: (item: TItem) => boolean
    orientation?: ListboxOrientation
    disabled?: boolean
  }
>

export type ListboxRootProps<TItem = unknown> = ListboxRootBaseProps<TItem> & {
  multiple?: boolean
  value?: SelectionValue | SelectionValue[] | undefined
  defaultValue?: SelectionValue | SelectionValue[] | undefined
  onChange?: (
    value: SelectionValue | SelectionValue[] | undefined,
    meta: ListboxChangeMeta<TItem>,
  ) => void
}

export function ListboxRoot<TItem = unknown>(props: ListboxRootProps<TItem>) {
  const [local, rest] = splitProps(props, [
    'items',
    'getItemValue',
    'getItemDisabled',
    'orientation',
    'disabled',
    'multiple',
    'value',
    'defaultValue',
    'onChange',
    'children',
  ])
  const optionMap = createMemo(() => {
    const map = new Map<SelectionValue, TItem>()
    for (const item of local.items ?? []) {
      const value = local.getItemValue ? local.getItemValue(item) : (item as { value: SelectionValue }).value
      map.set(value, item)
    }
    return map
  })
  const disabledValues = createMemo(() => {
    const values: SelectionValue[] = []
    for (const item of local.items ?? []) {
      const value = local.getItemValue ? local.getItemValue(item) : (item as { value: SelectionValue }).value
      if (local.disabled || local.getItemDisabled?.(item) || (item as { disabled?: boolean }).disabled) {
        values.push(value)
      }
    }
    return values
  })
  const controller = createSelectionController({
    get value() {
      return local.value
    },
    get defaultValue() {
      return local.defaultValue
    },
    get multiple() {
      return local.multiple
    },
    get disabledValues() {
      return disabledValues()
    },
    onChange(values, meta) {
      const selectedItems = values
        .map((value) => optionMap().get(value))
        .filter((item): item is TItem => item !== undefined)
      const changeMeta: ListboxChangeMeta<TItem> = {
        selectedItem: selectedItems[0],
        selectedItems,
        selectedValues: values,
        previousSelectedValues: meta.previousValues,
        changedValues: meta.changedValues,
      }
      if (local.multiple) {
        ;(local.onChange as ((values: SelectionValue[], meta: ListboxChangeMeta<TItem>) => void) | undefined)?.(
          values,
          changeMeta,
        )
        return
      }
      ;(local.onChange as ((value: SelectionValue | undefined, meta: ListboxChangeMeta<TItem>) => void) | undefined)?.(
        values[0],
        changeMeta,
      )
    },
  })
  const snapshot = createCoreStoreSignal(controller)
  const orientation = () => local.orientation ?? 'vertical'

  return (
    <ListboxContext.Provider
      value={{
        orientation: orientation(),
        selectedValues: () => {
          local.value
          local.multiple
          snapshot()
          return controller.getSnapshot().values
        },
        isSelected: controller.isSelected,
        isDisabled: controller.isDisabled,
        selectItem: (value) => {
          if (snapshot().multiple) {
            controller.toggle(value)
            return
          }
          controller.replace(value)
        },
      }}
    >
      <div
        {...rest}
        role="listbox"
        aria-multiselectable={snapshot().multiple || undefined}
        aria-orientation={orientation()}
        data-orientation={orientation()}
        data-slot="listbox"
      >
        {local.children}
      </div>
    </ListboxContext.Provider>
  )
}

export function ListboxGroup(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  const context = useListboxContext('ListboxGroup')
  return <div {...props} role="group" data-slot="listbox-group" data-orientation={context.orientation} />
}

export function ListboxGroupLabel(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  return <div {...props} data-slot="listbox-group-label" />
}

export interface ListboxItemProps extends ParentProps<Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onSelect'>> {
  value: SelectionValue
  disabled?: boolean
  onSelect?: (value: SelectionValue) => void
}

export function ListboxItem(props: ListboxItemProps) {
  const [local, rest] = splitProps(props, ['value', 'disabled', 'onSelect', 'children'])
  const context = useListboxContext('ListboxItem')
  const selected = () => context.selectedValues().includes(local.value)
  const disabled = () => local.disabled === true || context.isDisabled(local.value)
  const select = () => {
    if (disabled()) {
      return
    }
    context.selectItem(local.value)
    local.onSelect?.(local.value)
  }

  return (
    <div
      {...rest}
      role="option"
      tabIndex={disabled() ? undefined : 0}
      aria-selected={selected()}
      aria-disabled={disabled() || undefined}
      data-slot="listbox-item"
      data-selected={selected() ? 'true' : 'false'}
      data-disabled={disabled() ? 'true' : undefined}
      onClick={select}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
          return
        }
        event.preventDefault()
        select()
      }}
    >
      {local.children}
    </div>
  )
}

export function ListboxItemIndicator(props: ParentProps<JSX.HTMLAttributes<HTMLSpanElement>>) {
  return (
    <span {...props} aria-hidden="true" data-slot="listbox-item-indicator">
      {props.children}
    </span>
  )
}

export type { SelectionValue }
