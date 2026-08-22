<script lang="ts">
  import ChevronRightIcon from '@fex-design/svelte/icon/chevron-right'
  import { DropdownContent } from '@fex-design/svelte/primitive/dropdown'
  import { MenuItem, MenuList, MenuRoot } from '@fex-design/svelte/primitive/menu'
  import Popover from '@fex-design/svelte/primitive/popover'
  import PopoverPortal from '@fex-design/svelte/primitive/popover-portal'
  import PopoverTrigger from '@fex-design/svelte/primitive/popover-trigger'
  import { navListClassName, navPanelClassName, navTriggerClassName } from './demo-styles'
  const components = [
    ['Alert Dialog', 'A modal dialog that interrupts the user with important content.'],
    ['Hover Card', 'For sighted users to preview content behind a link.'],
    ['Progress', 'Displays an indicator showing completion progress.'],
    ['Scroll Area', 'Augments native scroll functionality for custom styling.'],
  ]
</script>

<MenuRoot role="navigation" aria-label="Product navigation">
  <MenuList orientation="horizontal" class={navListClassName}>
    <MenuItem value="getting-started">{#snippet trigger(slot)}<a {...slot.props} class={navTriggerClassName} href="#getting-started">Getting started</a>{/snippet}</MenuItem>
    <Popover trigger={['hover', 'click']} side="bottom" align="center">
      <PopoverTrigger>{#snippet children(popover)}<MenuItem value="components" submenu>{#snippet trigger(item)}<button {...item.props} {...popover.props} use:popover.action class={navTriggerClassName}><span>Components</span><ChevronRightIcon class="size-3.5 shrink-0 rotate-90" /></button>{/snippet}</MenuItem>{/snippet}</PopoverTrigger>
      <PopoverPortal><DropdownContent class={navPanelClassName}><MenuList orientation="vertical" parentValue="components" class="grid grid-cols-2 gap-1">{#each components as item (item[0])}<MenuItem value={item[0]}>{#snippet trigger(slot)}<a {...slot.props} href={`#${item[0].toLowerCase().replace(' ', '-')}`} class="block rounded-md p-3 outline-none transition-colors hover:bg-muted-background focus-visible:bg-muted-background"><div class="text-sm font-medium">{item[0]}</div><p class="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{item[1]}</p></a>{/snippet}</MenuItem>{/each}</MenuList></DropdownContent></PopoverPortal>
    </Popover>
    <MenuItem value="documentation">{#snippet trigger(slot)}<a {...slot.props} class={navTriggerClassName} href="#documentation">Documentation</a>{/snippet}</MenuItem>
  </MenuList>
</MenuRoot>
