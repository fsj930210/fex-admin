<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { datePickerConfirmClassName } from '@fex/components-styles/date-picker'
  import Button from '../button/button.svelte'
  import { useFooterOwner } from './date-picker-footer.svelte'
  interface Props extends Omit<HTMLButtonAttributes, 'children' | 'class'> { children?: Snippet }
  let { children, onclick, ...rest }: Props = $props()
  const owner = useFooterOwner()
</script>

<Button {...rest} data-slot="date-picker-confirm" class={datePickerConfirmClassName} onclick={(event) => { onclick?.(event); if (!event.defaultPrevented) owner.confirm() }}>
  {#if children}{@render children()}{:else}确定{/if}
</Button>
