# Menu primitive

Import `MenuRoot`, `MenuList`, `MenuItem`, `MenuGroup`, and `MenuDivider` from
`@fex/components-vue/primitive/menu`. These parts accept slots and native attributes; they never
accept menu data. `useMenu` remains an independent composable for callers intentionally building a
data-driven renderer. A floating submenu composes `MenuItem` as `PopoverTrigger` and places another
`MenuRoot` inside `PopoverContent`.
