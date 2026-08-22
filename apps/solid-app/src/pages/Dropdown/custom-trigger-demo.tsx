import * as Dropdown from '@fex-design/solid/primitive/dropdown'
import { PopoverPortal } from '@fex-design/solid/primitive/popover'
import { MenuAction, MenuSurface } from './demo-parts'
export function CustomTriggerDemo() { return <Dropdown.DropdownRoot><Dropdown.DropdownTrigger>{(slot) => <button {...slot.props} ref={slot.ref} class="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground" aria-label="Open account menu">FX</button>}</Dropdown.DropdownTrigger><PopoverPortal><Dropdown.DropdownContent><MenuSurface><MenuAction>Profile</MenuAction><MenuAction>Preferences</MenuAction><MenuAction>Sign out</MenuAction></MenuSurface></Dropdown.DropdownContent></PopoverPortal></Dropdown.DropdownRoot> }
