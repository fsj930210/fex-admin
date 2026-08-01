# Dropdown primitive

Import from `@fex/components-angular/primitive/dropdown`. `fex-dropdown` inherits Popover inputs and
the `openChange` output; `[fexDropdownTrigger]` binds the caller element with menu ARIA;
`fex-dropdown-content` defaults to menu semantics and closes its full ancestor chain after a leaf menu-item click unless
prevented. Dropdown accepts projected primitives and never menu data.

Always wrap floating content in the independent `fex-popover-portal`. Its `container` input wins
over the root resolver, which then falls back to the trigger document body. Custom panels may supply
their own semantics. A nested menu is another Popover whose trigger is the parent `MenuItem` and
whose content projects the same Menu primitives.
