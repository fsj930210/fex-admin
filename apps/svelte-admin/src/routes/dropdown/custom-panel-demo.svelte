<script lang="ts">
  import { DropdownContent, DropdownRoot, DropdownTrigger } from '@fex-design/svelte/primitive/dropdown'
  import PopoverPortal from '@fex-design/svelte/primitive/popover-portal'
  import Checkbox from '@fex-design/svelte/ui/checkbox'
  import { triggerClassName } from './demo-classes'
</script>
<DropdownRoot><DropdownTrigger>{#snippet children(slot)}<button {...slot.props} use:slot.action class={triggerClassName}>Filters</button>{/snippet}</DropdownTrigger><PopoverPortal><DropdownContent role="dialog" class="p-3"><div class="w-64 space-y-3"><h3 class="text-sm font-medium">Quick filters</h3><p class="text-xs text-muted-foreground">Content can host an additional custom panel.</p><div class="flex items-center gap-2 text-sm"><Checkbox id="svelte-filter-active" defaultChecked /><label for="svelte-filter-active">Only active records</label></div><div class="flex items-center gap-2 text-sm"><Checkbox id="svelte-filter-assigned" defaultChecked /><label for="svelte-filter-assigned">Assigned to me</label></div></div></DropdownContent></PopoverPortal></DropdownRoot>
