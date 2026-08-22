<script lang="ts">
  import TooltipRoot from '@fex-design/svelte/primitive/tooltip'
  import TooltipArrow from '@fex-design/svelte/primitive/tooltip-arrow'
  import TooltipContent from '@fex-design/svelte/primitive/tooltip-content'
  import TooltipPortal from '@fex-design/svelte/primitive/tooltip-portal'
  import TooltipTrigger from '@fex-design/svelte/primitive/tooltip-trigger'
  import Button from '@fex-design/svelte/ui/button'
  let open = $state(false)
</script>
<div class="flex gap-space-md"><Button variant="secondary" onclick={() => (open = !open)}>{open ? 'Close externally' : 'Open externally'}</Button><TooltipRoot {open} onOpenChange={(value) => (open = value)}><TooltipTrigger>{#snippet children(slot)}<Button {...slot.props} action={slot.action} variant="outline">Controlled trigger</Button>{/snippet}</TooltipTrigger><TooltipPortal><TooltipContent>Controlled state remains external<TooltipArrow /></TooltipContent></TooltipPortal></TooltipRoot></div>
