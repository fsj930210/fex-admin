import { ChevronDownIcon, ChevronRightIcon } from '@fex-design/solid/icon/chevron'
import * as Dropdown from '@fex-design/solid/primitive/dropdown'
import { MenuItem, MenuList, MenuRoot } from '@fex-design/solid/primitive/menu'
import * as Popover from '@fex-design/solid/primitive/popover'
import { horizontalItemClassName, horizontalListClassName, popupClassName, rootClassName, verticalItemClassName, verticalListClassName } from './demo-styles'

function PlatformMenu() {
  return <Popover.Popover trigger={['hover', 'click']} side="right" align="start"><Popover.PopoverTrigger>{(trigger) => <MenuItem {...trigger.props} ref={trigger.ref} value="platform" submenu aria-haspopup="menu" class={verticalItemClassName}><span class="flex-1 text-left">Platform</span><ChevronRightIcon class="size-4" /></MenuItem>}</Popover.PopoverTrigger><Popover.PopoverPortal><Dropdown.DropdownContent class={popupClassName}><MenuList orientation="vertical" parentValue="platform" class={verticalListClassName}><MenuItem value="api" class={verticalItemClassName}>API</MenuItem><MenuItem value="automation" class={verticalItemClassName}>Automation</MenuItem><MenuItem value="integrations" class={verticalItemClassName}>Integrations</MenuItem></MenuList></Dropdown.DropdownContent></Popover.PopoverPortal></Popover.Popover>
}

function ProductsMenu() {
  return <Popover.Popover trigger={['hover', 'click']} side="bottom" align="start"><Popover.PopoverTrigger>{(trigger) => <MenuItem {...trigger.props} ref={trigger.ref} value="products" submenu aria-haspopup="menu" class={horizontalItemClassName}><span>Products</span><ChevronDownIcon class="size-3.5 shrink-0" /></MenuItem>}</Popover.PopoverTrigger><Popover.PopoverPortal><Dropdown.DropdownContent class={popupClassName}><MenuList orientation="vertical" parentValue="products" class={verticalListClassName}><MenuItem value="analytics" class={verticalItemClassName}>Analytics</MenuItem><PlatformMenu /><MenuItem value="security" class={verticalItemClassName}>Security</MenuItem></MenuList></Dropdown.DropdownContent></Popover.PopoverPortal></Popover.Popover>
}

export function HorizontalNestedDemo() {
  return <MenuRoot role="navigation" aria-label="Nested navigation" class={rootClassName}><MenuList orientation="horizontal" class={horizontalListClassName}><MenuItem value="home" class={horizontalItemClassName}>Home</MenuItem><ProductsMenu /><MenuItem value="pricing" class={horizontalItemClassName}>Pricing</MenuItem></MenuList></MenuRoot>
}
