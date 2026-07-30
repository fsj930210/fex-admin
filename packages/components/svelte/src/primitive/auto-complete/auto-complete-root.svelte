<script lang="ts">
  import { createAutoCompleteController } from '@fex/components-core/auto-complete/create-auto-complete-controller'
  import type { AutoCompleteChangeMeta, AutoCompleteFieldNames } from '@fex/components-core/auto-complete/types'
  import type { FloatingAlign, FloatingPlacement, FloatingSide } from '@fex/components-core/floating/placement'
  import type { Snippet } from 'svelte'
  import { readableCoreStore } from '../../stores/core-store'
  import Popover from '../popover/popover.svelte'
  import { setAutoCompleteContext } from './context'
  type Item = Record<string, unknown>
  interface Props {
    children?: Snippet
    items?: readonly Item[]
    fieldNames?: Partial<AutoCompleteFieldNames<Item>>
    value?: string
    defaultValue?: string
    open?: boolean
    defaultOpen?: boolean
    filterOption?: boolean | ((keyword: string, item: Item) => boolean)
    loading?: boolean
    disabled?: boolean
    readOnly?: boolean
    closeOnSelect?: boolean
    loop?: boolean
    placement?: FloatingPlacement
    side?: FloatingSide
    align?: FloatingAlign
    alignOffset?: number
    sideOffset?: number
    onChange?: (value: string, meta: AutoCompleteChangeMeta<Item>) => void
    onSearch?: (value: string, meta: { reason: 'input' | 'clear'; previousValue: string }) => void
    onSelect?: (value: string, meta: { selectedItem: Item; selectedKey: string | number; previousValue: string }) => void
    onClear?: (meta: { previousValue: string }) => void
    onOpenChange?: (open: boolean, meta: { reason: string }) => void
  }
  let { children, items = [], fieldNames, value, defaultValue, open, defaultOpen, filterOption, loading = false, disabled = false, readOnly = false, closeOnSelect, loop, placement, side, align, alignOffset, sideOffset, onChange, onSearch, onSelect, onClear, onOpenChange }: Props = $props()
  const controller = createAutoCompleteController<Item>({
    get items() { return items },
    get fieldNames() { return fieldNames },
    get value() { return value },
    get defaultValue() { return defaultValue },
    get open() { return open },
    get defaultOpen() { return defaultOpen },
    get filterOption() { return filterOption },
    get closeOnSelect() { return closeOnSelect },
    get loop() { return loop },
    onChange: (next, meta) => onChange?.(next, meta),
    onSearch: (next, meta) => onSearch?.(next, meta),
    onSelect: (next, meta) => onSelect?.(next, meta),
    onClear: meta => onClear?.(meta),
    onOpenChange: (next, meta) => onOpenChange?.(next, meta),
  })
  const snapshot = readableCoreStore(controller)
  setAutoCompleteContext({ controller, snapshot, items: () => { items; $snapshot.value; return controller.getVisibleItems() }, loading: () => loading, disabled: () => disabled, readOnly: () => readOnly, listId: `auto-complete-${crypto.randomUUID()}` })
</script>
<Popover open={$snapshot.open} defaultOpen={defaultOpen} trigger={[]} {placement} {side} {align} {alignOffset} {sideOffset} onOpenChange={next => controller.setOpen(next, next ? 'programmatic' : 'outside')}>{@render children?.()}</Popover>
