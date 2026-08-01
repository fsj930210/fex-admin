<script lang="ts">
  import TooltipRoot from '@fex/components-svelte/primitive/tooltip'
  import TooltipArrow from '@fex/components-svelte/primitive/tooltip-arrow'
  import TooltipContent from '@fex/components-svelte/primitive/tooltip-content'
  import TooltipPortal from '@fex/components-svelte/primitive/tooltip-portal'
  import TooltipTrigger from '@fex/components-svelte/primitive/tooltip-trigger'
  import Button from '@fex/components-svelte/ui/button'
</script>
<TooltipRoot><TooltipTrigger>{#snippet children(slot)}<span {...slot.props} use:slot.action tabindex="0" class="inline-flex rounded-md focus-visible:ring-3 focus-visible:ring-focus/50"><Button disabled class="pointer-events-none" variant="outline">Disabled</Button></span>{/snippet}</TooltipTrigger><TooltipPortal><TooltipContent>This feature is currently unavailable<TooltipArrow /></TooltipContent></TooltipPortal></TooltipRoot>
