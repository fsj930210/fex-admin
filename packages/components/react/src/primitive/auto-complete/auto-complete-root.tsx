import { createAutoCompleteController } from '@fex/components-core/auto-complete/create-auto-complete-controller'
import type {
  AutoCompleteChangeMeta,
  AutoCompleteControllerOptions,
  AutoCompleteFieldNames,
  AutoCompleteItem,
} from '@fex/components-core/auto-complete/types'
import { type ComponentProps, type ReactNode, useId, useRef } from 'react'
import { useCoreStore } from '../../hooks/use-core-store'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'
import { PopoverRoot } from '../popover/popover'
import { AutoCompleteContext } from './auto-complete-context'

export interface AutoCompleteRootProps<TItem extends object = AutoCompleteItem>
  extends Omit<ComponentProps<typeof PopoverRoot>, 'children' | 'open' | 'defaultOpen' | 'onOpenChange' | 'trigger'> {
  children?: ReactNode
  items?: readonly TItem[]
  fieldNames?: Partial<AutoCompleteFieldNames<TItem>>
  value?: string
  defaultValue?: string
  onChange?: (value: string, meta: AutoCompleteChangeMeta<TItem>) => void
  onSearch?: AutoCompleteControllerOptions<TItem>['onSearch']
  onSelect?: AutoCompleteControllerOptions<TItem>['onSelect']
  onClear?: AutoCompleteControllerOptions<TItem>['onClear']
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: AutoCompleteControllerOptions<TItem>['onOpenChange']
  filterOption?: AutoCompleteControllerOptions<TItem>['filterOption']
  loading?: boolean
  disabled?: boolean
  readOnly?: boolean
  closeOnSelect?: boolean
  loop?: boolean
}

export function AutoCompleteRoot<TItem extends object = AutoCompleteItem>(
  props: AutoCompleteRootProps<TItem>,
) {
  const latest = useRef(props)
  latest.current = props
  const controllerRef = useRef<ReturnType<typeof createAutoCompleteController<TItem>> | null>(null)
  controllerRef.current ??= createAutoCompleteController({
    get items() { return latest.current.items },
    get fieldNames() { return latest.current.fieldNames },
    get value() { return latest.current.value },
    get defaultValue() { return latest.current.defaultValue },
    get open() { return latest.current.open },
    get defaultOpen() { return latest.current.defaultOpen },
    get filterOption() { return latest.current.filterOption },
    get closeOnSelect() { return latest.current.closeOnSelect },
    get loop() { return latest.current.loop },
    onChange: (value, meta) => latest.current.onChange?.(value, meta),
    onSearch: (value, meta) => latest.current.onSearch?.(value, meta),
    onSelect: (value, meta) => latest.current.onSelect?.(value, meta),
    onClear: (meta) => latest.current.onClear?.(meta),
    onOpenChange: (open, meta) => latest.current.onOpenChange?.(open, meta),
  })
  const snapshot = useCoreStore(controllerRef.current)
  const handleOpenChange = useMemoizedFn((open: boolean) =>
    controllerRef.current?.setOpen(open, open ? 'programmatic' : 'outside'))
  const {
    children,
    items,
    fieldNames,
    value,
    defaultValue,
    onChange,
    onSearch,
    onSelect,
    onClear,
    open,
    defaultOpen,
    onOpenChange,
    filterOption,
    loading,
    disabled,
    readOnly,
    closeOnSelect,
    loop,
    ...popoverProps
  } = props
  return (
    <AutoCompleteContext
      value={{
        controller: controllerRef.current,
        items: controllerRef.current.getVisibleItems(),
        fieldNames,
        loading: loading === true,
        disabled: disabled === true,
        readOnly: readOnly === true,
        listId: `auto-complete-${useId()}`,
      }}
    >
      <PopoverRoot
        {...popoverProps}
        trigger={[]}
        open={snapshot.open}
        defaultOpen={defaultOpen}
        disabled={disabled}
        onOpenChange={handleOpenChange}
      >
        {children}
      </PopoverRoot>
    </AutoCompleteContext>
  )
}
