# Tour

Tour is a composable guided-tour primitive for Solid. Compose `TourRoot`, `TourTarget`, `TourStep`, `TourPortal`, `TourOverlay`, `TourContent`, `TourArrow`, and `TourControl`; no steps array or built-in title, description, progress, or card layout is required.

Targets and overlays expose render props, and the arrow is optional but must be placed inside content so it can register with the floating positioning core. Closing hides the tour and preserves the current step. Use `useTour().goTo(0)` when a workflow should restart.
