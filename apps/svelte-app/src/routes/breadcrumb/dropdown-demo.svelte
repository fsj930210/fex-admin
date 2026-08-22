<script lang="ts">
  import { DropdownContent, DropdownRoot, DropdownTrigger } from '@fex-design/svelte/primitive/dropdown'
  import Breadcrumb from '@fex-design/svelte/primitive/breadcrumb'
  import PopoverPortal from '@fex-design/svelte/primitive/popover-portal'
</script>

<DropdownRoot>
  <DropdownTrigger>
    {#snippet children(slot)}
      <button {...slot.props} use:slot.action class="inline-flex size-7 items-center justify-center rounded-md hover:bg-muted-background" type="button" aria-label="Show hidden path"><Breadcrumb part="ellipsis" /></button>
    {/snippet}
  </DropdownTrigger>
  <PopoverPortal><DropdownContent><div class="min-w-40 space-y-1 p-1" role="menu"><button class="block w-full rounded px-2 py-1 text-left hover:bg-muted-background" role="menuitem" type="button">Planning</button><button class="block w-full rounded px-2 py-1 text-left hover:bg-muted-background" role="menuitem" type="button">Archive</button></div></DropdownContent></PopoverPortal>
</DropdownRoot>
