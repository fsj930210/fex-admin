# Tour

Tour is a composable guided-tour primitive for Angular. Compose `fex-tour`, `fex-tour-step`, `fex-tour-portal`, `fex-tour-overlay`, `fex-tour-content`, `fex-tour-arrow`, and `fex-tour-control`; targets are registered with the `fexTourTarget` directive. The primitive does not require a steps array or impose content layout.

The overlay uses a rectangular spotlight and content uses the shared floating core. Closing preserves the current step; call `root.controller.goTo(0)` before opening when a workflow should restart. Portal stays mounted so step registration is stable.
