import { ChevronRightIcon } from '@fex/components-react/icon/chevron'
import * as Dropdown from '@fex/components-react/primitive/dropdown'
import * as Popover from '@fex/components-react/primitive/popover'
import { MenuAction, MenuSurface, triggerClassName } from './demo-parts'

const submenuProps: Popover.PopoverRootProps = {
  trigger: ['hover'],
  side: 'right' as const,
  align: 'start' as const,
  sideOffset: 6,
}

function MoreFormats() {
  return (
    <Popover.PopoverRoot {...submenuProps}>
      <Popover.PopoverTrigger>
        {(props) => <MenuAction {...props}>More formats <ChevronRightIcon className="size-4" /></MenuAction>}
      </Popover.PopoverTrigger>
      <Popover.PopoverPortal>
        <Dropdown.DropdownContent><MenuSurface><MenuAction>CSV</MenuAction><MenuAction>JSON</MenuAction></MenuSurface></Dropdown.DropdownContent>
      </Popover.PopoverPortal>
    </Popover.PopoverRoot>
  )
}

function ExportMenu() {
  return (
    <Popover.PopoverRoot {...submenuProps}>
      <Popover.PopoverTrigger>
        {(props) => <MenuAction {...props}>Export <ChevronRightIcon className="size-4" /></MenuAction>}
      </Popover.PopoverTrigger>
      <Popover.PopoverPortal>
        <Dropdown.DropdownContent>
          <MenuSurface><MenuAction>PDF</MenuAction><MenuAction>Spreadsheet</MenuAction><MoreFormats /></MenuSurface>
        </Dropdown.DropdownContent>
      </Popover.PopoverPortal>
    </Popover.PopoverRoot>
  )
}

export function NestedDemo() {
  return (
    <Dropdown.DropdownRoot trigger={['hover']}>
      <Dropdown.DropdownTrigger>{(props) => <button {...props} className={triggerClassName}>File</button>}</Dropdown.DropdownTrigger>
      <Popover.PopoverPortal>
        <Dropdown.DropdownContent><MenuSurface><MenuAction>New</MenuAction><ExportMenu /></MenuSurface></Dropdown.DropdownContent>
      </Popover.PopoverPortal>
    </Dropdown.DropdownRoot>
  )
}
