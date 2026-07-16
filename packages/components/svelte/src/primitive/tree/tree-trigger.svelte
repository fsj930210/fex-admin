<script lang="ts">
  import type { AsyncLoadFeatureApi } from '@fex/components-core/tree/features/async-load'
  import type { ExpansionFeatureApi } from '@fex/components-core/tree/features/expansion'
  import type { TreeKey } from '@fex/components-core/tree/types'
  import { treeTriggerClassName } from '@fex/components-styles/tree'
  import { cn } from '@fex/utils'
  import { getContext, type Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { readableCoreStore } from '../../stores/core-store'
  import { treeContextKey, type TreeContext } from './tree-context'

  interface Props extends Omit<HTMLButtonAttributes, 'children'> {
    itemKey: TreeKey
    children?: Snippet
  }

  let { itemKey, children, class: className, onclick, ...rest }: Props = $props()
  const { tree } = getContext<TreeContext>(treeContextKey)
  const snapshot = readableCoreStore({
    getSnapshot: tree.getSnapshot,
    subscribe: (listener) => tree.subscribeNode(itemKey, listener),
  })
  const item = $derived.by(() => {
    void $snapshot
    return tree.getItem(itemKey)
  })
  const expanded = $derived($snapshot.expandedKeys.includes(itemKey))
  const expansion = () => tree.getFeature<ExpansionFeatureApi>('expansion')

  function click(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
    event.stopPropagation()
    onclick?.(event)
    if (event.defaultPrevented) return
    if (expanded) {
      expansion()?.collapse(itemKey)
      return
    }
    const loading = tree.getFeature<AsyncLoadFeatureApi>('async-load')?.load(itemKey)
    if (!loading) {
      expansion()?.expand(itemKey)
      return
    }
    void loading.then((result) => {
      if ((result as { ok?: boolean } | undefined)?.ok) expansion()?.expand(itemKey)
    })
  }
</script>

{#if !item || item.isLeaf || !expansion()}
  <span aria-hidden="true" data-slot="tree-trigger-placeholder" class="size-5 shrink-0"></span>
{:else}
  <button
    {...rest}
    type="button"
    data-slot="tree-trigger"
    aria-expanded={expanded}
    class={cn(treeTriggerClassName, className)}
    onclick={click}
  >
    {#if children}
      {@render children()}
    {:else}
      <svg aria-hidden="true" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m6 9 6 6 6-6"></path>
      </svg>
    {/if}
  </button>
{/if}
