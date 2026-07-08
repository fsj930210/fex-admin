<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { CheckboxCheckedState } from '@fex/components-core/checkbox/types'

  interface CheckboxIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
    checked?: CheckboxCheckedState
    forceMount?: boolean
    children?: Snippet
  }

  let { checked = false, forceMount = false, children, ...rest }: CheckboxIndicatorProps = $props()
  const state = $derived(checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked')
</script>

{#if forceMount || checked !== false}
  <span {...rest} data-state={state}>
    {@render children?.()}
  </span>
{/if}
