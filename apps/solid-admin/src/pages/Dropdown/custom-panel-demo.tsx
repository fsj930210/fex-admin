import * as Dropdown from '@fex/components-solid/primitive/dropdown'
import { PopoverPortal } from '@fex/components-solid/primitive/popover'
import { Checkbox } from '@fex/components-solid/ui/checkbox'
import { triggerClassName } from './demo-parts'

export function CustomPanelDemo() {
  return <Dropdown.DropdownRoot><Dropdown.DropdownTrigger>{(slot) => <button {...slot.props} ref={slot.ref} class={triggerClassName}>Filters</button>}</Dropdown.DropdownTrigger><PopoverPortal><Dropdown.DropdownContent role="dialog" class="p-3"><div class="w-64 space-y-3"><h3 class="text-sm font-medium">Quick filters</h3><p class="text-xs text-muted-foreground">Content can host an additional custom panel.</p><div class="flex items-center gap-2 text-sm"><Checkbox id="solid-filter-active" defaultChecked /><label for="solid-filter-active">Only active records</label></div><div class="flex items-center gap-2 text-sm"><Checkbox id="solid-filter-assigned" defaultChecked /><label for="solid-filter-assigned">Assigned to me</label></div></div></Dropdown.DropdownContent></PopoverPortal></Dropdown.DropdownRoot>
}
