# Dropdown primitive

Dropdown composes Popover and Menu primitives. Import it from
`@fex/components-vue/primitive/dropdown`; it accepts slots and never `items`.

`DropdownRoot` accepts the Popover controlled/uncontrolled, trigger, placement, offset and dismiss
props. `DropdownTrigger` exposes `props`, `ref`, and `state` through its slot and sets menu ARIA.
`DropdownContent` defaults to `role="menu"` and closes its full ancestor chain after a leaf menu-item click unless the event
is prevented. Use `PopoverPortal :container="element"` to control mounting. Custom panels may set a
different role. Nested menus compose another Popover with the parent `MenuItem` as its trigger.
