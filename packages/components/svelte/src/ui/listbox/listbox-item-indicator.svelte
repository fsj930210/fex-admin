<script lang="ts">
  import { listboxItemIndicatorClassName } from '@fex/components-styles/listbox'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import CheckIcon from '../../icon/check.svelte'
  import PrimitiveListboxItemIndicator from '../../primitive/listbox/listbox-item-indicator.svelte'

  let { class: className, children, ...rest }: { class?: string; children?: Snippet; [key: string]: unknown } = $props()
</script>

<PrimitiveListboxItemIndicator {...rest} class={cn(listboxItemIndicatorClassName, className)}>
  {#if children}
    {@render children()}
  {:else}
    <CheckIcon />
  {/if}
</PrimitiveListboxItemIndicator>
