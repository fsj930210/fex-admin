<script lang="ts">
  import { DropdownContent, DropdownRoot, DropdownTrigger } from '@fex/components-svelte/primitive/dropdown'
  import PopoverPortal from '@fex/components-svelte/primitive/popover-portal'
  import { triggerClassName } from './demo-classes'
  import MenuAction from './menu-action.svelte'
  import MenuSurface from './menu-surface.svelte'
</script>
<DropdownRoot><DropdownTrigger>{#snippet children(slot)}<button {...slot.props} use:slot.action class={triggerClassName}>Actions</button>{/snippet}</DropdownTrigger><PopoverPortal><DropdownContent><MenuSurface><MenuAction>Edit</MenuAction><MenuAction>Duplicate</MenuAction><MenuAction>Archive</MenuAction></MenuSurface></DropdownContent></PopoverPortal></DropdownRoot>
