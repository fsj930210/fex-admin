# Tour

Tour is a composable Svelte 5 guided-tour primitive. Compose the root, target, step, portal, overlay, content, arrow, and control components; there is no required steps array or built-in content layout.

Targets and overlays expose snippets for custom DOM. The optional arrow must be rendered inside content so it can register with the floating positioning core. Closing hides the tour and preserves the current step; call `controller.goTo(0)` through a custom action to restart.
