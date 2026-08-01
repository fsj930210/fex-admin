import * as Dropdown from '@fex/components-react/primitive/dropdown'
import { PopoverPortal } from '@fex/components-react/primitive/popover'
import { MenuAction, MenuSurface, triggerClassName } from './demo-parts'

export function BasicDemo() {
  return (
    <Dropdown.DropdownRoot>
      <Dropdown.DropdownTrigger>
        {(props) => <button {...props} className={triggerClassName}>Actions</button>}
      </Dropdown.DropdownTrigger>
      <PopoverPortal>
        <Dropdown.DropdownContent>
          <MenuSurface><MenuAction>Edit</MenuAction><MenuAction>Duplicate</MenuAction><MenuAction>Archive</MenuAction></MenuSurface>
        </Dropdown.DropdownContent>
      </PopoverPortal>
    </Dropdown.DropdownRoot>
  )
}
