<script lang="ts">
  import { DropdownContent } from '@fex-design/svelte/primitive/dropdown'
  import { MenuItem, MenuList, MenuRoot } from '@fex-design/svelte/primitive/menu'
  import Popover from '@fex-design/svelte/primitive/popover'
  import PopoverPortal from '@fex-design/svelte/primitive/popover-portal'
  import PopoverTrigger from '@fex-design/svelte/primitive/popover-trigger'
  import { horizontalListClassName, menubarClassName, menubarTriggerClassName, popupClassName, verticalItemClassName, verticalListClassName } from './demo-styles'
  const menus = [
    { name: 'File', items: ['New file', 'Open…', 'Save'] },
    { name: 'Edit', items: ['Undo', 'Redo', 'Find'] },
    { name: 'View', items: ['Zoom in', 'Zoom out', 'Full screen'] },
    { name: 'Profiles', items: ['Andy', 'Benoit', 'Add Profile…'] },
  ]
</script>

<MenuRoot role="menubar" aria-label="Editor commands" class={menubarClassName}>
  <MenuList orientation="horizontal" class={horizontalListClassName}>
    {#each menus as menu (menu.name)}
      <Popover trigger={['click']} side="bottom" align="start">
        <PopoverTrigger>{#snippet children(popover)}
          <MenuItem value={menu.name} submenu>{#snippet trigger(item)}
            <button {...item.props} {...popover.props} use:popover.action aria-haspopup="menu" class={menubarTriggerClassName}>{menu.name}</button>
          {/snippet}</MenuItem>
        {/snippet}</PopoverTrigger>
        <PopoverPortal><DropdownContent class={popupClassName}><MenuList orientation="vertical" parentValue={menu.name} class={verticalListClassName}>{#each menu.items as label (label)}<MenuItem value={`${menu.name}-${label}`} class={verticalItemClassName}>{label}</MenuItem>{/each}</MenuList></DropdownContent></PopoverPortal>
      </Popover>
    {/each}
  </MenuList>
</MenuRoot>
