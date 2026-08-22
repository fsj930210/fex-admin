import { ChevronDownIcon } from '@fex-design/react/icon/chevron'
import * as Dropdown from '@fex-design/react/primitive/dropdown'
import { MenuItem, MenuList, MenuRoot } from '@fex-design/react/primitive/menu'
import * as Popover from '@fex-design/react/primitive/popover'
import { navListClassName, navPanelClassName, navTriggerClassName } from './demo-styles'

const components = [
  ['Alert Dialog', 'A modal dialog that interrupts the user with important content.'],
  ['Hover Card', 'For sighted users to preview content behind a link.'],
  ['Progress', 'Displays an indicator showing completion progress.'],
  ['Scroll Area', 'Augments native scroll functionality for custom styling.'],
]

function ComponentsMenu() {
  return (
    <Popover.PopoverRoot trigger={['hover', 'click']} side="bottom" align="center">
      <Popover.PopoverTrigger>
        {(trigger) => (
          <MenuItem value="components" submenu>
            {({ props }) => (
              <button {...props} {...trigger} className={navTriggerClassName}>
                <span>Components</span>
                <ChevronDownIcon className="size-3.5 shrink-0" />
              </button>
            )}
          </MenuItem>
        )}
      </Popover.PopoverTrigger>
      <Popover.PopoverPortal>
        <Dropdown.DropdownContent className={navPanelClassName}>
          <MenuList orientation="vertical" parentValue="components" className="grid grid-cols-2 gap-1">
            {components.map(([label, description]) => (
              <MenuItem key={label} value={label}>
                {({ props }) => <a {...props} href={`#${label.toLowerCase().replace(' ', '-')}`} className="block rounded-md p-3 outline-none transition-colors hover:bg-muted-background focus-visible:bg-muted-background"><div className="text-sm font-medium">{label}</div><p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{description}</p></a>}
              </MenuItem>
            ))}
          </MenuList>
        </Dropdown.DropdownContent>
      </Popover.PopoverPortal>
    </Popover.PopoverRoot>
  )
}

export function NavDemo() {
  return <MenuRoot role="navigation" aria-label="Product navigation"><MenuList orientation="horizontal" className={navListClassName}><MenuItem value="getting-started">{({ props }) => <a {...props} className={navTriggerClassName} href="#getting-started">Getting started</a>}</MenuItem><ComponentsMenu /><MenuItem value="documentation">{({ props }) => <a {...props} className={navTriggerClassName} href="#documentation">Documentation</a>}</MenuItem></MenuList></MenuRoot>
}
