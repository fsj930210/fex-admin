# Dropdown primitive

Dropdown is the primitive-only composition of Popover and Menu. Import from
`@fex/components-solid/primitive/dropdown`. Root reuses Popover controlled/uncontrolled state,
triggers, placement, offsets and dismissal. Trigger exposes Popover render bindings with menu ARIA.
Content accepts children rather than menu data, defaults to `role="menu"`, and closes its full ancestor chain on a leaf
menu-item click unless prevented. Use `PopoverPortal` for mounting, override the role for custom
panels, and compose a nested Popover around a parent `MenuItem` for multilevel menus.
