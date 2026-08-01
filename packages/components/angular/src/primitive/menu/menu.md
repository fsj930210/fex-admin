# Menu primitive

Import `MenuRoot`, `MenuList`, and `MenuItem` from
`@fex/components-angular/primitive/menu`. Compose them as `fex-menu-root`, `fex-menu-list`, and
`button[fexMenuItem]`; none accepts menu data. Existing data traversal helpers remain independent.
For a floating submenu, apply both `fexMenuItem` and `fexPopoverTrigger` to the parent button and
project another Menu into the nested Popover content.
