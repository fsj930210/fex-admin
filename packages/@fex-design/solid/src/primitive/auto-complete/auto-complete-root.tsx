import { createAutoCompleteController } from '@fex-design/core/auto-complete/create-auto-complete-controller'
import type {
  AutoCompleteChangeMeta,
  AutoCompleteControllerOptions,
  AutoCompleteFieldNames,
} from '@fex-design/core/auto-complete/types'
import { createMemo, createUniqueId, type ParentProps } from 'solid-js'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'
import { Popover, type PopoverProps } from '../popover/popover'
import { AutoCompleteContext, type AutoCompleteContextValue } from './context'

export interface AutoCompleteRootProps<TItem extends object = Record<string, unknown>>
  extends ParentProps, Omit<PopoverProps, 'children' | 'open' | 'defaultOpen' | 'onOpenChange'> {
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
export function AutoCompleteRoot<TItem extends object = Record<string, unknown>>(
  props: AutoCompleteRootProps<TItem>,
) {
  const controller = createAutoCompleteController<TItem>({
    get items() {
      return props.items
    },
    get fieldNames() {
      return props.fieldNames
    },
    get value() {
      return props.value
    },
    get defaultValue() {
      return props.defaultValue
    },
    get open() {
      return props.open
    },
    get defaultOpen() {
      return props.defaultOpen
    },
    get filterOption() {
      return props.filterOption
    },
    get closeOnSelect() {
      return props.closeOnSelect
    },
    get loop() {
      return props.loop
    },
    onChange: (value, meta) => props.onChange?.(value, meta),
    onSearch: (value, meta) => props.onSearch?.(value, meta),
    onSelect: (value, meta) => props.onSelect?.(value, meta),
    onClear: (meta) => props.onClear?.(meta),
    onOpenChange: (open, meta) => props.onOpenChange?.(open, meta),
  })
  const snapshot = createCoreStoreSignal(controller)
  const context = {
    controller,
    snapshot,
    items: createMemo(() => {
      void props.items
      void snapshot().value
      return controller.getVisibleItems()
    }),
    loading: () => props.loading === true,
    disabled: () => props.disabled === true,
    readOnly: () => props.readOnly === true,
    listId: `auto-complete-${createUniqueId()}`,
  }
  return (
    <AutoCompleteContext.Provider value={context as unknown as AutoCompleteContextValue}>
      <Popover
        trigger={[]}
        {...(props.placement === undefined ? {} : { placement: props.placement })}
        {...(props.side === undefined ? {} : { side: props.side })}
        {...(props.align === undefined ? {} : { align: props.align })}
        {...(props.alignOffset === undefined ? {} : { alignOffset: props.alignOffset })}
        {...(props.sideOffset === undefined ? {} : { sideOffset: props.sideOffset })}
        {...(props.arrow === undefined ? {} : { arrow: props.arrow })}
        {...(props.getPopupContainer === undefined
          ? {}
          : { getPopupContainer: props.getPopupContainer })}
        {...(props.hoverCloseDelay === undefined ? {} : { hoverCloseDelay: props.hoverCloseDelay })}
        {...(props.hoverOpenDelay === undefined ? {} : { hoverOpenDelay: props.hoverOpenDelay })}
        {...(props.defaultOpen === undefined ? {} : { defaultOpen: props.defaultOpen })}
        open={snapshot().open}
        onOpenChange={(open) => controller.setOpen(open, open ? 'programmatic' : 'outside')}
      >
        {props.children}
      </Popover>
    </AutoCompleteContext.Provider>
  )
}
