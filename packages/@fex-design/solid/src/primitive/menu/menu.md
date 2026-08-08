# Menu primitive

Import the compositional Menu parts from `@fex-design/solid/primitive/menu`. `MenuList` owns one
keyboard-navigation level and accepts `orientation="vertical|horizontal"` plus optional
`parentValue`. `MenuItem` renders a button by default or exposes native binding props to a custom
element through a function child.

For floating nesting, combine a submenu MenuItem with the existing Popover primitives and render a
vertical child MenuList in PopoverContent. Menu owns direction and focus; Popover owns trigger,
placement, Portal and dismissal. The primitive has no items-array API and no built-in search.
