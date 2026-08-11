# TreeSelect primitive

TreeSelect composes the existing Input, Popover, Tree, Listbox, and Checkbox primitives. It owns
only value selection, value-to-item registration, and optional search text. It does not request
data, filter nodes, choose a result shape, or prescribe result markup.

## Search patterns

- Synchronous search: keep the keyword in application state and reuse Tree's search feature to
  render a pruned tree.
- Async single search: a flat result list is usually the clearest interaction. We recommend that the
  server return a stable node key, label, and structured ancestor path. Showing the full path
  disambiguates duplicate labels. After selection, the application may request the target's ancestor
  subtree and render that Tree in the same panel.
- Async tree search: returning a pruned tree is also valid when hierarchy comparison matters more
  than compact scanning. The application chooses which result representation fits its workflow.
- Async value echo: resolve persisted keys before or while rendering and pass the resolved items to
  TreeSelect so the Input can display labels without requiring the Popover content to mount.

## Multiple-selection guidance

For remote multiple selection, keep selected values outside the current search result set so they
survive keyword changes. Checkbox rows are the recommended presentation because they make existing
selections visible when several results are chosen. A select-style row remains supported, and users
may render any Tree, Listbox, tags, or custom panel they need.

## Composition API

- Root/controller: controlled or uncontrolled value state, multiple mode, disabled state, registered
  items, and clear/select/toggle actions.
- Trigger: supplies Popover trigger bindings, Input bindings, selected items, and a clear action.
- Content: the existing Popover content surface.
- Option: registers a value/label/node/path item and exposes selected/select state to custom markup.

The items input is useful for initial and asynchronous echo because it establishes value-to-label
mapping before option rows are mounted. Search requests, cancellation, loading, empty/error states,
result ranking, path formatting, and subtree loading all remain application-owned.

