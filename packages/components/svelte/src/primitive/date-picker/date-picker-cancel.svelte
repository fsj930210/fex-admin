<script lang="ts">
  import type { Snippet } from 'svelte'
  import { datePickerCancelClassName } from '@fex/components-styles/date-picker'
  import Button from '../button/button.svelte'
  import { useFooterOwner } from './date-picker-footer.svelte'
  interface Props { children?: Snippet }
  let { children }: Props = $props()
  const owner = useFooterOwner()
</script>

<Button data-slot="date-picker-cancel" class={datePickerCancelClassName} onclick={() => owner.cancel()}>
  {#if children}{@render children()}{:else}取消{/if}
</Button>
