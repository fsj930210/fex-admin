<script lang="ts">
  import TooltipRoot from '@fex-design/svelte/primitive/tooltip'
  import TooltipArrow from '@fex-design/svelte/primitive/tooltip-arrow'
  import TooltipContent from '@fex-design/svelte/primitive/tooltip-content'
  import TooltipPortal from '@fex-design/svelte/primitive/tooltip-portal'
  import TooltipTrigger from '@fex-design/svelte/primitive/tooltip-trigger'
  import Button from '@fex-design/svelte/ui/button'
  import Kbd from '@fex-design/svelte/ui/kbd'
</script>
<div class="flex gap-space-md"><TooltipRoot><TooltipTrigger>{#snippet children(slot)}<Button {...slot.props} action={slot.action} variant="outline">Hover or focus</Button>{/snippet}</TooltipTrigger><TooltipPortal><TooltipContent>Helpful information<TooltipArrow /></TooltipContent></TooltipPortal></TooltipRoot><TooltipRoot><TooltipTrigger>{#snippet children(slot)}<Button {...slot.props} action={slot.action} variant="outline">Save</Button>{/snippet}</TooltipTrigger><TooltipPortal><TooltipContent class="flex items-center gap-2">Save changes <Kbd>S</Kbd><TooltipArrow /></TooltipContent></TooltipPortal></TooltipRoot></div>
