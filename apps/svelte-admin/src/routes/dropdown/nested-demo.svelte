<script lang="ts">
  import ChevronRightIcon from '@fex/components-svelte/icon/chevron-right'
  import { DropdownContent, DropdownRoot, DropdownTrigger } from '@fex/components-svelte/primitive/dropdown'
  import Popover from '@fex/components-svelte/primitive/popover'
  import PopoverPortal from '@fex/components-svelte/primitive/popover-portal'
  import PopoverTrigger from '@fex/components-svelte/primitive/popover-trigger'
  import { triggerClassName } from './demo-classes'
  import MenuAction from './menu-action.svelte'
  import MenuSurface from './menu-surface.svelte'
</script>

<DropdownRoot trigger={['hover']}><DropdownTrigger>{#snippet children(slot)}<button {...slot.props} use:slot.action class={triggerClassName}>File</button>{/snippet}</DropdownTrigger><PopoverPortal><DropdownContent><MenuSurface><MenuAction>New</MenuAction>
  <Popover trigger={['hover']} side="right" align="start" sideOffset={6}>
    <PopoverTrigger>{#snippet children(slot)}<MenuAction {...slot.props} action={slot.action}>Export <ChevronRightIcon class="size-4" /></MenuAction>{/snippet}</PopoverTrigger>
    <PopoverPortal><DropdownContent><MenuSurface><MenuAction>PDF</MenuAction><MenuAction>Spreadsheet</MenuAction>
      <Popover trigger={['hover']} side="right" align="start" sideOffset={6}>
        <PopoverTrigger>{#snippet children(slot)}<MenuAction {...slot.props} action={slot.action}>More formats <ChevronRightIcon class="size-4" /></MenuAction>{/snippet}</PopoverTrigger>
        <PopoverPortal><DropdownContent><MenuSurface><MenuAction>CSV</MenuAction><MenuAction>JSON</MenuAction></MenuSurface></DropdownContent></PopoverPortal>
      </Popover>
    </MenuSurface></DropdownContent></PopoverPortal>
  </Popover>
</MenuSurface></DropdownContent></PopoverPortal></DropdownRoot>
