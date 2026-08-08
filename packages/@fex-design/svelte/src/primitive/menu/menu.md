# Menu primitive

Import `MenuRoot`, `MenuList`, and `MenuItem` from `@fex-design/svelte/primitive/menu`. MenuList
accepts `orientation="vertical|horizontal"` and optional `parentValue`. MenuItem renders a button by
default; its `trigger` snippet receives native props for a completely custom link or button.

Nested floating menus compose the existing Popover and another vertical MenuList. Popover owns its
click/hover trigger, delays, placement, Portal and dismissal. Menu owns direction keys, Home/End,
disabled-item skipping and parent focus restoration. Menu does not own search or an items-array API.
