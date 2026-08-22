import * as Dropdown from '@fex-design/solid/primitive/dropdown'
import { PopoverPortal } from '@fex-design/solid/primitive/popover'
import { MenuAction, MenuSurface, triggerClassName } from './demo-parts'
export function BasicDemo() { return <Dropdown.DropdownRoot><Dropdown.DropdownTrigger>{(slot) => <button {...slot.props} ref={slot.ref} class={triggerClassName}>Actions</button>}</Dropdown.DropdownTrigger><PopoverPortal><Dropdown.DropdownContent><MenuSurface><MenuAction>Edit</MenuAction><MenuAction>Duplicate</MenuAction><MenuAction>Archive</MenuAction></MenuSurface></Dropdown.DropdownContent></PopoverPortal></Dropdown.DropdownRoot> }
