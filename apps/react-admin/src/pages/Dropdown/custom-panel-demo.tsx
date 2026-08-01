import * as Dropdown from '@fex/components-react/primitive/dropdown'
import { PopoverPortal } from '@fex/components-react/primitive/popover'
import { Checkbox } from '@fex/components-react/ui/checkbox'
import { triggerClassName } from './demo-parts'

export function CustomPanelDemo() {
  return (
    <Dropdown.DropdownRoot>
      <Dropdown.DropdownTrigger>{(props) => <button {...props} className={triggerClassName}>Filters</button>}</Dropdown.DropdownTrigger>
      <PopoverPortal><Dropdown.DropdownContent role="dialog" className="p-3"><div className="w-64 space-y-3"><div><h3 className="text-sm font-medium">Quick filters</h3><p className="text-xs text-muted-foreground">Dropdown content can host an additional primitive panel.</p></div><div className="flex items-center gap-2 text-sm"><Checkbox id="react-filter-active" defaultChecked /><label htmlFor="react-filter-active">Only active records</label></div><div className="flex items-center gap-2 text-sm"><Checkbox id="react-filter-assigned" defaultChecked /><label htmlFor="react-filter-assigned">Assigned to me</label></div></div></Dropdown.DropdownContent></PopoverPortal>
    </Dropdown.DropdownRoot>
  )
}
