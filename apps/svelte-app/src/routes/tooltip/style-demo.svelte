<script lang="ts">
  import TooltipRoot from '@fex-design/svelte/primitive/tooltip'
  import TooltipArrow from '@fex-design/svelte/primitive/tooltip-arrow'
  import TooltipContent from '@fex-design/svelte/primitive/tooltip-content'
  import TooltipPortal from '@fex-design/svelte/primitive/tooltip-portal'
  import TooltipTrigger from '@fex-design/svelte/primitive/tooltip-trigger'
  import Button from '@fex-design/svelte/ui/button'
</script>
<div class="flex gap-space-md"><TooltipRoot><TooltipTrigger>{#snippet children(slot)}<Button {...slot.props} action={slot.action} variant="outline">Custom color</Button>{/snippet}</TooltipTrigger><TooltipPortal><TooltipContent class="[--tooltip-background:#db2777] [--tooltip-foreground:white]">One variable colors both surfaces<TooltipArrow /></TooltipContent></TooltipPortal></TooltipRoot><TooltipRoot><TooltipTrigger>{#snippet children(slot)}<Button {...slot.props} action={slot.action} variant="outline">Without arrow</Button>{/snippet}</TooltipTrigger><TooltipPortal><TooltipContent>No TooltipArrow is rendered</TooltipContent></TooltipPortal></TooltipRoot></div>
