<script lang="ts">
  import TooltipRoot from '@fex-design/svelte/primitive/tooltip'
  import TooltipArrow from '@fex-design/svelte/primitive/tooltip-arrow'
  import TooltipContent from '@fex-design/svelte/primitive/tooltip-content'
  import TooltipPortal from '@fex-design/svelte/primitive/tooltip-portal'
  import TooltipTrigger from '@fex-design/svelte/primitive/tooltip-trigger'
  import Button from '@fex-design/svelte/ui/button'
  const placements = ['topLeft', 'top', 'topRight', 'leftTop', 'rightTop', 'left', 'right', 'leftBottom', 'rightBottom', 'bottomLeft', 'bottom', 'bottomRight'] as const
</script>
<div class="grid grid-cols-3 gap-space-md py-space-lg">{#each placements as placement (placement)}<TooltipRoot {placement}><TooltipTrigger>{#snippet children(slot)}<Button {...slot.props} action={slot.action} class="h-16" variant="outline">{placement}</Button>{/snippet}</TooltipTrigger><TooltipPortal><TooltipContent>{placement}<TooltipArrow /></TooltipContent></TooltipPortal></TooltipRoot>{/each}</div>
