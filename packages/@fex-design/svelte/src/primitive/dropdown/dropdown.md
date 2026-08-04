# Dropdown primitive

Import `DropdownRoot`, `DropdownTrigger`, and `DropdownContent` from
`@fex-design/svelte/primitive/dropdown`. They reuse Popover state, triggers, positioning and
dismissal, accept snippets, and never accept `items`. Trigger supplies `props`, `action`, and `state`
with menu ARIA. Content defaults to `role="menu"` and closes its full ancestor chain after a leaf menu-item click unless
prevented. Use `PopoverPortal` to control mounting, override the role for custom panels, and compose
another Popover around a parent `MenuItem` for submenus.
