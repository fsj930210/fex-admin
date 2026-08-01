# Menu primitive

Import the children-based `MenuRoot`, `MenuList`, and `MenuItem` components from
`@fex/components-svelte/primitive/menu`. They accept snippets and native attributes, not `items`.
`MenuItem` also accepts the DOM action supplied by `PopoverTrigger`, allowing the same item to be a
submenu trigger. The existing data helpers remain separate from the structural primitive API.
