# Tour

Tour is a composable guided-tour primitive. Register targets and steps by composing components; the primitive does not require a `steps` array and does not impose title, description, progress, or card markup.

Import from `@fex-design/vue/primitive/tour`. The public parts are `TourRoot`, `TourStep`, `TourTarget`, `TourPortal`, `TourOverlay`, `TourContent`, `TourArrow`, and `TourControl`. `useTour` exposes the snapshot and controller actions for custom UI.

`TourTarget` and `TourOverlay` use slot props so their DOM can be replaced. `TourArrow` is optional and must be placed inside `TourContent`; it registers itself with the floating positioning core. `TourPortal` remains mounted while closed so steps and targets stay registered.

`open` and `current` are controlled props. `defaultOpen` and `defaultCurrent` provide uncontrolled state. Closing hides the tour and keeps the current step; call `goTo(0)` explicitly when a workflow should restart.
