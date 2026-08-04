import { ChevronRightIcon } from '@fex-design/solid/icon/chevron'
import * as Dropdown from '@fex-design/solid/primitive/dropdown'
import * as Popover from '@fex-design/solid/primitive/popover'
import { MenuAction, MenuSurface, triggerClassName } from './demo-parts'

const submenuProps: Popover.PopoverProps = {
  trigger: ['hover'], side: 'right', align: 'start', sideOffset: 6,
}

function More() {
  return <Popover.Popover {...submenuProps}><Popover.PopoverTrigger>{(slot) => <MenuAction {...slot.props} ref={slot.ref}>More <ChevronRightIcon class="size-4" /></MenuAction>}</Popover.PopoverTrigger><Popover.PopoverPortal><Dropdown.DropdownContent><MenuSurface><MenuAction>CSV</MenuAction><MenuAction>JSON</MenuAction></MenuSurface></Dropdown.DropdownContent></Popover.PopoverPortal></Popover.Popover>
}

function Export() {
  return <Popover.Popover {...submenuProps}><Popover.PopoverTrigger>{(slot) => <MenuAction {...slot.props} ref={slot.ref}>Export <ChevronRightIcon class="size-4" /></MenuAction>}</Popover.PopoverTrigger><Popover.PopoverPortal><Dropdown.DropdownContent><MenuSurface><MenuAction>PDF</MenuAction><MenuAction>Spreadsheet</MenuAction><More /></MenuSurface></Dropdown.DropdownContent></Popover.PopoverPortal></Popover.Popover>
}

export function NestedDemo() {
  return <Dropdown.DropdownRoot trigger={['hover']}><Dropdown.DropdownTrigger>{(slot) => <button {...slot.props} ref={slot.ref} class={triggerClassName}>File</button>}</Dropdown.DropdownTrigger><Popover.PopoverPortal><Dropdown.DropdownContent><MenuSurface><MenuAction>New</MenuAction><Export /></MenuSurface></Dropdown.DropdownContent></Popover.PopoverPortal></Dropdown.DropdownRoot>
}
