<script lang="ts">
  import { createTooltip, type TooltipOptions } from '@fex-design/core/tooltip/create-tooltip'
  import type { Snippet } from 'svelte'
  import { onDestroy, setContext } from 'svelte'
  import { readableCoreStore } from '../../stores/core-store'
  import { tooltipContextKey } from './tooltip-context'
  interface TooltipProps extends TooltipOptions { children?: Snippet }
  let { children, open, defaultOpen, onOpenChange, ...rest }: TooltipProps = $props()
  // svelte-ignore state_referenced_locally -- defaultOpen is an uncontrolled initial value.
  let localOpen = $state(defaultOpen ?? false)
  const contentId = $props.id()
  function options(): TooltipOptions { return { ...rest, open: open ?? localOpen, onOpenChange(nextOpen, info) { if (open === undefined) localOpen = nextOpen; onOpenChange?.(nextOpen, info) } } }
  const overlay = createTooltip(options())
  const snapshot = readableCoreStore(overlay)
  setContext(tooltipContextKey, { contentId, overlay, snapshot, triggerElement: { current: null } })
  $effect(() => overlay.setOptions(options()))
  onDestroy(() => overlay.destroy())
</script>
{@render children?.()}
