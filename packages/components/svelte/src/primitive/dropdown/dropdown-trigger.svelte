<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import PopoverTrigger from '../popover/popover-trigger.svelte'
  import type { PopoverContext } from '../popover/popover-context'

  interface Props {
    children: Snippet<[
      {
        action: (element: HTMLElement) => { destroy: () => void }
        props: HTMLButtonAttributes
        state: ReturnType<PopoverContext['overlay']['getSnapshot']>
      },
    ]>
  }
  let { children }: Props = $props()
</script>

<PopoverTrigger>
  {#snippet children(slot)}
    {@render children({ ...slot, props: { ...slot.props, 'aria-haspopup': 'menu' } })}
  {/snippet}
</PopoverTrigger>
