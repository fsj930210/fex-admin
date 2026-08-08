# Menu primitive

Import `MenuRoot`, `MenuList`, and `MenuItem` from `@fex-design/angular/primitive/menu`. Apply
`fexMenuItem` to the caller's button, anchor or custom focusable host. MenuList accepts
`orientation="vertical|horizontal"` and optional `parentValue`.

A floating submenu places `fexMenuItem` and `fexPopoverTrigger` on the same trigger element, then
renders another vertical MenuList inside PopoverContent. Menu owns keyboard direction and focus;
Popover owns trigger policy, placement, Portal and dismissal. No items-array or search API is part
of the primitive.
