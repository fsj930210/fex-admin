<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { TreeSelectItem } from '@fex-design/core/tree-select/types'
  import { getContext } from 'svelte'
  import PopoverTrigger from '../popover/popover-trigger.svelte'
  import { treeSelectContextKey, type TreeSelectContext } from './context'
  interface State {
    trigger: { action(element: HTMLElement): { destroy(): void }; props: HTMLAttributes<HTMLDivElement>; state: unknown }
    inputProps: { readonly: boolean; value: string; oninput(event: Event): void; onfocus(): void; onclick(): void }
    selectedItems: readonly TreeSelectItem[]
    clear(): void
  }
  let { children }: { children?: Snippet<[State]> } = $props()
  const context = getContext<TreeSelectContext>(treeSelectContextKey)
  const snapshot = context.snapshot
</script>
<PopoverTrigger>
  {#snippet children(trigger)}
    {@const selectedItems = $snapshot.selectedItems}
    {@render children?.({
      trigger: { ...trigger, props: trigger.props as unknown as HTMLAttributes<HTMLDivElement> },
      inputProps: {
        readonly: !context.searchable(),
        value: $snapshot.multiple ? context.searchValue() : context.searchable() && context.searchValue() ? context.searchValue() : selectedItems.map(item => item.label).join(', '),
        oninput: (event: Event) => context.setSearchValue((event.currentTarget as HTMLInputElement).value),
        onfocus: context.openPanel,
        onclick: context.openPanel,
      },
      selectedItems,
      clear: () => { context.controller.clear(); context.setSearchValue('') },
    })}
  {/snippet}
</PopoverTrigger>
