import { ChevronDownIcon } from '@fex-design/solid/icon/chevron'
import * as Dropdown from '@fex-design/solid/primitive/dropdown'
import { MenuItem, MenuList, MenuRoot } from '@fex-design/solid/primitive/menu'
import * as Popover from '@fex-design/solid/primitive/popover'
import { For } from 'solid-js'
import { navListClassName, navPanelClassName, navTriggerClassName } from './demo-styles'

const components = [
  ['Alert Dialog', 'A modal dialog that interrupts the user with important content.'],
  ['Hover Card', 'For sighted users to preview content behind a link.'],
  ['Progress', 'Displays an indicator showing completion progress.'],
  ['Scroll Area', 'Augments native scroll functionality for custom styling.'],
]

function ComponentsMenu() {
  return <Popover.Popover trigger={['hover', 'click']} side="bottom" align="center"><Popover.PopoverTrigger>{(trigger) => <MenuItem {...trigger.props} ref={trigger.ref} value="components" submenu class={navTriggerClassName}><span>Components</span><ChevronDownIcon class="size-3.5 shrink-0" /></MenuItem>}</Popover.PopoverTrigger><Popover.PopoverPortal><Dropdown.DropdownContent class={navPanelClassName}><MenuList orientation="vertical" parentValue="components" class="grid grid-cols-2 gap-1"><For each={components}>{([label, description]) => <MenuItem value={label}>{(slot) => <a {...slot.props} href={`#${label.toLowerCase().replace(' ', '-')}`} class="block rounded-md p-3 outline-none transition-colors hover:bg-muted-background focus-visible:bg-muted-background"><div class="text-sm font-medium">{label}</div><p class="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{description}</p></a>}</MenuItem>}</For></MenuList></Dropdown.DropdownContent></Popover.PopoverPortal></Popover.Popover>
}

export function NavDemo() {
  return <MenuRoot role="navigation" aria-label="Product navigation"><MenuList orientation="horizontal" class={navListClassName}><MenuItem value="getting-started">{(slot) => <a {...slot.props} class={navTriggerClassName} href="#getting-started">Getting started</a>}</MenuItem><ComponentsMenu /><MenuItem value="documentation">{(slot) => <a {...slot.props} class={navTriggerClassName} href="#documentation">Documentation</a>}</MenuItem></MenuList></MenuRoot>
}
