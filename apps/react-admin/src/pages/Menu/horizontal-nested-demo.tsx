import { ChevronDownIcon, ChevronRightIcon } from '@fex-design/react/icon/chevron'
import * as Dropdown from '@fex-design/react/primitive/dropdown'
import { MenuItem, MenuList, MenuRoot } from '@fex-design/react/primitive/menu'
import * as Popover from '@fex-design/react/primitive/popover'
import {
  horizontalItemClassName,
  horizontalListClassName,
  popupClassName,
  rootClassName,
  verticalItemClassName,
  verticalListClassName,
} from './demo-styles'

function PlatformMenu() {
  return (
    <Popover.PopoverRoot trigger={['hover', 'click']} side="right" align="start">
      <Popover.PopoverTrigger>
        {(trigger) => (
          <MenuItem value="platform" submenu>
            {({ props }) => (
              <button {...props} {...trigger} aria-haspopup="menu" className={verticalItemClassName}>
                <span className="flex-1 text-left">Platform</span>
                <ChevronRightIcon className="size-4" />
              </button>
            )}
          </MenuItem>
        )}
      </Popover.PopoverTrigger>
      <Popover.PopoverPortal>
        <Dropdown.DropdownContent className={popupClassName}>
          <MenuList orientation="vertical" parentValue="platform" className={verticalListClassName}>
            <MenuItem value="api" className={verticalItemClassName}>API</MenuItem>
            <MenuItem value="automation" className={verticalItemClassName}>Automation</MenuItem>
            <MenuItem value="integrations" className={verticalItemClassName}>Integrations</MenuItem>
          </MenuList>
        </Dropdown.DropdownContent>
      </Popover.PopoverPortal>
    </Popover.PopoverRoot>
  )
}

function ProductsMenu() {
  return (
    <Popover.PopoverRoot trigger={['hover', 'click']} side="bottom" align="start">
      <Popover.PopoverTrigger>
        {(trigger) => (
          <MenuItem value="products" submenu>
            {({ props }) => (
              <button {...props} {...trigger} aria-haspopup="menu" className={horizontalItemClassName}>
                <span>Products</span>
                <ChevronDownIcon className="size-3.5 shrink-0" />
              </button>
            )}
          </MenuItem>
        )}
      </Popover.PopoverTrigger>
      <Popover.PopoverPortal>
        <Dropdown.DropdownContent className={popupClassName}>
          <MenuList orientation="vertical" parentValue="products" className={verticalListClassName}>
            <MenuItem value="analytics" className={verticalItemClassName}>Analytics</MenuItem>
            <PlatformMenu />
            <MenuItem value="security" className={verticalItemClassName}>Security</MenuItem>
          </MenuList>
        </Dropdown.DropdownContent>
      </Popover.PopoverPortal>
    </Popover.PopoverRoot>
  )
}

export function HorizontalNestedDemo() {
  return (
    <MenuRoot role="navigation" aria-label="Nested navigation" className={rootClassName}>
      <MenuList orientation="horizontal" className={horizontalListClassName}>
        <MenuItem value="home" className={horizontalItemClassName}>Home</MenuItem>
        <ProductsMenu />
        <MenuItem value="pricing" className={horizontalItemClassName}>Pricing</MenuItem>
      </MenuList>
    </MenuRoot>
  )
}
