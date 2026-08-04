<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { datePickerCancelClassName } from '@fex-design/styles/date-picker'
  import Button from '../button/button.svelte'
  import { useFooterOwner } from './date-picker-footer.svelte'
  interface Props extends Omit<HTMLButtonAttributes, 'children' | 'class'> { children?: Snippet }
  let { children, onclick, ...rest }: Props = $props()
  const owner = useFooterOwner()
</script>

<Button {...rest} data-slot="date-picker-cancel" class={datePickerCancelClassName} onclick={(event) => { onclick?.(event); if (!event.defaultPrevented) owner.cancel() }}>
  {#if children}{@render children()}{:else}取消{/if}
</Button>
