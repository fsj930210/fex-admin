import { createAutoCompleteController } from '@fex/components-core/auto-complete/create-auto-complete-controller'
import type {
  AutoCompleteChangeMeta,
  AutoCompleteControllerOptions,
  AutoCompleteFieldNames,
} from '@fex/components-core/auto-complete/types'
import { createMemo, createUniqueId, type ParentProps } from 'solid-js'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'
import { Popover, type PopoverProps } from '../popover/popover'
import { AutoCompleteContext } from './context'

type Item = Record<string, unknown>
export interface AutoCompleteRootProps extends ParentProps, Omit<PopoverProps, 'children' | 'open' | 'defaultOpen' | 'onOpenChange'> {
  items?: readonly Item[]
  fieldNames?: Partial<AutoCompleteFieldNames<Item>>
  value?: string
  defaultValue?: string
  onChange?: (value: string, meta: AutoCompleteChangeMeta<Item>) => void
  onSearch?: AutoCompleteControllerOptions<Item>['onSearch']
  onSelect?: AutoCompleteControllerOptions<Item>['onSelect']
  onClear?: AutoCompleteControllerOptions<Item>['onClear']
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: AutoCompleteControllerOptions<Item>['onOpenChange']
  filterOption?: AutoCompleteControllerOptions<Item>['filterOption']
  loading?: boolean
  disabled?: boolean
  readOnly?: boolean
  closeOnSelect?: boolean
  loop?: boolean
}
export function AutoCompleteRoot(props: AutoCompleteRootProps) {
  const controller = createAutoCompleteController<Item>({
    get items() { return props.items },
    get fieldNames() { return props.fieldNames },
    get value() { return props.value },
    get defaultValue() { return props.defaultValue },
    get open() { return props.open },
    get defaultOpen() { return props.defaultOpen },
    get filterOption() { return props.filterOption },
    get closeOnSelect() { return props.closeOnSelect },
    get loop() { return props.loop },
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
      props.items
      snapshot().value
      return controller.getVisibleItems()
    }),
    loading: () => props.loading === true,
    disabled: () => props.disabled === true,
    readOnly: () => props.readOnly === true,
    listId: `auto-complete-${createUniqueId()}`,
  }
  return (
    <AutoCompleteContext.Provider value={context}>
      <Popover
        trigger={[]}
        placement={props.placement}
        side={props.side}
        align={props.align}
        alignOffset={props.alignOffset}
        sideOffset={props.sideOffset}
        arrow={props.arrow}
        getPopupContainer={props.getPopupContainer}
        hoverCloseDelay={props.hoverCloseDelay}
        hoverOpenDelay={props.hoverOpenDelay}
        open={snapshot().open}
        defaultOpen={props.defaultOpen}
        onOpenChange={(open) => controller.setOpen(open, open ? 'programmatic' : 'outside')}
      >
        {props.children}
      </Popover>
    </AutoCompleteContext.Provider>
  )
}
