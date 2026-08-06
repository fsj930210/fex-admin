<script lang="ts">
  import { tourControlClassName } from '@fex-design/styles/tour'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { tourContextKey, type TourContext } from './tour-context'
  type Props = HTMLButtonAttributes & { action: 'previous' | 'next' | 'skip' | 'close' | 'complete'; children?: Snippet; disabled?: boolean }
  let { action, children, class: className, disabled = false, ...rest }: Props = $props()
  const { controller, snapshot } = getContext<TourContext>(tourContextKey)
  const isDisabled = $derived(disabled || (action === 'previous' && $snapshot.isFirst))
  function click() { if (isDisabled) return; if (action === 'previous') void controller.previous(); else if (action === 'next') void controller.next(); else if (action === 'skip') controller.skip(); else if (action === 'close') controller.close(); else controller.complete() }
</script>
<button {...rest} type="button" disabled={isDisabled} data-tour-action={action} class={cn(tourControlClassName, className)} onclick={click}>{@render children?.()}</button>
