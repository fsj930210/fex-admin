# Menu primitive

Import `MenuRoot`, `MenuList`, `MenuItem`, `MenuGroup`, and `MenuDivider` from
`@fex-design/vue/primitive/menu`. The same primitive supports vertical menus, horizontal navigation,
menubar styling and nested menus.

`MenuList` accepts `orientation="vertical|horizontal"` and optional `parentValue`. `MenuItem`
accepts `value`, `disabled`, `selected`, and `submenu`; use its named `trigger` slot to bind the
provided native props to any link or button. A floating submenu composes Popover and another
vertical MenuList. Popover continues to own click/hover, delays, positioning, Portal and dismissal.

Direction keys, Home, End, disabled-item skipping and parent focus restoration are shared through
the framework-neutral Menu navigation core. Menu does not accept an items array or perform search.
