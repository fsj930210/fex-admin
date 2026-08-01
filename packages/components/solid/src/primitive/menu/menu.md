# Menu primitive

`MenuRoot`, `MenuList`, `MenuItem`, `MenuGroup`, and `MenuDivider` are children-based structural
primitives exported by `@fex/components-solid/primitive/menu`. They forward native attributes and do
not accept `items`. `createMenu` remains a separate logic API for data-driven renderers. Compose a
parent `MenuItem` with Popover to create a floating submenu.
