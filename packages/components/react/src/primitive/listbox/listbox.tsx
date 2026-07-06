import { createSelectionController } from '@fex/components-core/selection/create-selection-controller'
import type { SelectionValue } from '@fex/components-core/selection/types'
import { cn } from '@fex/utils'
import {
  createContext,
  type ComponentProps,
  type ReactNode,
  use,
  useRef,
} from 'react'
import { useCoreStore } from '../../hooks/use-core-store'

export type ListboxOrientation = 'vertical' | 'horizontal'

export type ListboxChangeMeta<TItem> = {
  selectedItem?: TItem | undefined
  selectedItems: TItem[]
  selectedValues: SelectionValue[]
  previousSelectedValues: SelectionValue[]
  changedValues: SelectionValue[]
}

type ListboxContextValue = {
  multiple: boolean
  orientation: ListboxOrientation
  isSelected: (value: SelectionValue) => boolean
  isDisabled: (value: SelectionValue) => boolean
  selectItem: (value: SelectionValue) => void
}

const ListboxContext = createContext<ListboxContextValue | null>(null)

function useListboxContext(component: string) {
  const context = use(ListboxContext)
  if (!context) {
    throw new Error(`${component} must be used inside ListboxRoot.`)
  }
  return context
}

type BaseListboxRootProps<TItem> = Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> & {
  items?: readonly TItem[]
  getItemValue?: (item: TItem) => SelectionValue
  getItemDisabled?: (item: TItem) => boolean
  orientation?: ListboxOrientation
  disabled?: boolean
}

export type ListboxRootProps<TItem = unknown> = BaseListboxRootProps<TItem> & {
  multiple?: boolean
  value?: SelectionValue | SelectionValue[] | undefined
  defaultValue?: SelectionValue | SelectionValue[] | undefined
  onChange?: (
    value: SelectionValue | SelectionValue[] | undefined,
    meta: ListboxChangeMeta<TItem>,
  ) => void
}

export function ListboxRoot<TItem = unknown>({
  items = [],
  getItemValue,
  getItemDisabled,
  orientation = 'vertical',
  disabled = false,
  multiple,
  value,
  defaultValue,
  onChange,
  className,
  children,
  ...props
}: ListboxRootProps<TItem>) {
  const optionMap = new Map<SelectionValue, TItem>()
  const disabledValues: SelectionValue[] = []

  for (const item of items) {
    const itemValue = getItemValue ? getItemValue(item) : (item as { value: SelectionValue }).value
    optionMap.set(itemValue, item)
    if (getItemDisabled?.(item) === true || (item as { disabled?: boolean }).disabled === true) {
      disabledValues.push(itemValue)
    }
  }

  const handleChange = (values: SelectionValue[], meta: { previousValues: SelectionValue[]; changedValues: SelectionValue[] }) => {
      const selectedItems = values
        .map((itemValue) => optionMap.get(itemValue))
        .filter((item): item is TItem => item !== undefined)
      const changeMeta: ListboxChangeMeta<TItem> = {
        selectedItem: selectedItems[0],
        selectedItems,
        selectedValues: values,
        previousSelectedValues: meta.previousValues,
        changedValues: meta.changedValues,
      }

      if (multiple) {
        ;(onChange as ((values: SelectionValue[], meta: ListboxChangeMeta<TItem>) => void) | undefined)?.(
          values,
          changeMeta,
        )
        return
      }

      ;(onChange as ((value: SelectionValue | undefined, meta: ListboxChangeMeta<TItem>) => void) | undefined)?.(
        values[0],
        changeMeta,
      )
    }

  const optionsRef = useRef({
    value,
    defaultValue,
    multiple,
    disabledValues,
    onChange: handleChange,
  })

  Object.assign(optionsRef.current, {
    value,
    defaultValue,
    multiple,
    disabledValues: disabled ? [...disabledValues, ...Array.from(optionMap.keys())] : disabledValues,
    onChange: handleChange,
  })

  const controllerRef = useRef<ReturnType<typeof createSelectionController> | null>(null)
  controllerRef.current ??= createSelectionController(optionsRef.current)
  const snapshot = useCoreStore(controllerRef.current)

  return (
    <ListboxContext
      value={{
        multiple: snapshot.multiple,
        orientation,
        isSelected: controllerRef.current.isSelected,
        isDisabled: controllerRef.current.isDisabled,
        selectItem: (itemValue) => {
          if (snapshot.multiple) {
            controllerRef.current?.toggle(itemValue)
            return
          }
          controllerRef.current?.replace(itemValue)
        },
      }}
    >
      <div
        {...props}
        role="listbox"
        aria-multiselectable={snapshot.multiple || undefined}
        aria-orientation={orientation}
        data-orientation={orientation}
        data-slot="listbox"
        className={cn(className)}
      >
        {children}
      </div>
    </ListboxContext>
  )
}

export function ListboxGroup({ className, ...props }: ComponentProps<'div'>) {
  const context = useListboxContext('ListboxGroup')
  return (
    <div
      {...props}
      role="group"
      data-slot="listbox-group"
      data-orientation={context.orientation}
      className={className}
    />
  )
}

export function ListboxGroupLabel({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} data-slot="listbox-group-label" className={className} />
}

export interface ListboxItemProps extends Omit<ComponentProps<'div'>, 'onSelect'> {
  value: SelectionValue
  disabled?: boolean
  onSelect?: (value: SelectionValue) => void
}

export function ListboxItem({ value, disabled, onSelect, className, onClick, children, ...props }: ListboxItemProps) {
  const context = useListboxContext('ListboxItem')
  const selected = context.isSelected(value)
  const itemDisabled = disabled === true || context.isDisabled(value)

  return (
    <div
      {...props}
      role="option"
      aria-selected={selected}
      aria-disabled={itemDisabled || undefined}
      tabIndex={itemDisabled ? undefined : 0}
      data-slot="listbox-item"
      data-selected={selected ? 'true' : 'false'}
      data-disabled={itemDisabled ? 'true' : undefined}
      className={className}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || itemDisabled) {
          return
        }
        context.selectItem(value)
        onSelect?.(value)
      }}
      onKeyDown={(event) => {
        if (itemDisabled || (event.key !== 'Enter' && event.key !== ' ')) {
          return
        }
        event.preventDefault()
        context.selectItem(value)
        onSelect?.(value)
      }}
    >
      {children}
    </div>
  )
}

export function ListboxItemIndicator({ children, className, ...props }: ComponentProps<'span'>) {
  return (
    <span {...props} aria-hidden="true" data-slot="listbox-item-indicator" className={className}>
      {children}
    </span>
  )
}

export type { SelectionValue }
