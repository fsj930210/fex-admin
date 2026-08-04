<script lang="ts">
  import { DropdownContent, DropdownRoot, DropdownTrigger } from '@fex-design/svelte/primitive/dropdown'
  import PopoverPortal from '@fex-design/svelte/primitive/popover-portal'
  import MenuAction from './menu-action.svelte'
  import MenuSurface from './menu-surface.svelte'
</script>
<DropdownRoot><DropdownTrigger>{#snippet children(slot)}<button {...slot.props} use:slot.action class="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground" aria-label="Open account menu">FX</button>{/snippet}</DropdownTrigger><PopoverPortal><DropdownContent><MenuSurface><MenuAction>Profile</MenuAction><MenuAction>Preferences</MenuAction><MenuAction>Sign out</MenuAction></MenuSurface></DropdownContent></PopoverPortal></DropdownRoot>
