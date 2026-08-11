<script lang="ts">
  import { createTreeSelectController } from '@fex-design/core/tree-select/create-tree-select-controller'
  import type { TreeSelectItem, TreeSelectValue } from '@fex-design/core/tree-select/types'
  import type { Snippet } from 'svelte'
  import { setContext } from 'svelte'
  import { readableCoreStore } from '../../stores/core-store'
  import Popover from '../popover/popover.svelte'
  import { treeSelectContextKey, type TreeSelectContext } from './context'
  interface Props {
    children?: Snippet<[{ controller: ReturnType<typeof createTreeSelectController>; state: ReturnType<ReturnType<typeof createTreeSelectController>['getSnapshot']> }]>
    items?: readonly TreeSelectItem[]
    value?: TreeSelectValue | readonly TreeSelectValue[] | undefined
    defaultValue?: TreeSelectValue | readonly TreeSelectValue[] | undefined
    multiple?: boolean
    disabled?: boolean
    searchable?: boolean
    searchValue?: string | undefined
    defaultSearchValue?: string
    open?: boolean
    defaultOpen?: boolean
    onChange?: (value: TreeSelectValue | TreeSelectValue[] | undefined, meta: Record<string, unknown>) => void
    onSearchValueChange?: (value: string) => void
    onOpenChange?: (open: boolean, info: unknown) => void
  }
  let { children, items, value, defaultValue, multiple = false, disabled = false, searchable = false, searchValue, defaultSearchValue = '', open, defaultOpen, onChange, onSearchValueChange, onOpenChange }: Props = $props()
  let localSearch = $state(defaultSearchValue)
  let localOpen = $state(defaultOpen ?? false)
  const controller = createTreeSelectController({
    get items() { return items }, get value() { return value }, get defaultValue() { return defaultValue },
    get multiple() { return multiple }, get disabled() { return disabled },
    onChange(next, meta) { onChange?.(next, meta) },
  })
  const snapshot = readableCoreStore(controller)
  $effect(() => controller.updateOptions({ items, value, multiple, disabled }))
  function setSearchValue(next: string) {
    if (searchValue === undefined) localSearch = next
    onSearchValueChange?.(next)
  }
  function requestOpen(next: boolean) {
    if (open === undefined) localOpen = next
    onOpenChange?.(next, { source: 'trigger' })
  }
  setContext<TreeSelectContext>(treeSelectContextKey, {
    controller, snapshot, searchable: () => searchable,
    searchValue: () => searchValue ?? localSearch, setSearchValue,
    openPanel: () => requestOpen(true), closePanel: () => requestOpen(false),
  })
</script>
<Popover open={open ?? localOpen} trigger={[]} onOpenChange={(next, info) => { if (open === undefined) localOpen = next; onOpenChange?.(next, info) }}>
  {@render children?.({ controller, state: $snapshot })}
</Popover>
