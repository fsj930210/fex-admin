# Steps

Steps represents the stages of one workflow. Use Timeline for independent historical events.

## Import

Import `Steps`, `Step`, `StepIndicator`, and `StepContent` from the framework package's `primitive/steps` entry (Svelte exposes the four component file entries).

## Core usage

Each `Step` requires a stable, unique `value: string | number`. `current` and `defaultCurrent` refer to that value, never to an array index. Content and indicators are fully composable.

## Props

| Component | Prop | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Steps | current | StepValue | - | Controlled current value. |
| Steps | defaultCurrent | StepValue | - | Initial uncontrolled value. |
| Steps | navigation | boolean | false | Enables pointer and keyboard navigation. |
| Steps | orientation | horizontal \| vertical | horizontal | Layout direction. |
| Steps | responsive | boolean | true | Lets horizontal layout become vertical in a narrow container. |
| Steps | onChange | (value, meta) => void | - | Navigation request callback. |
| Step | value | string \| number | required | Stable node identity. |
| Step | disabled | boolean | false | Prevents navigation to the node. |
| Step | status | wait \| process \| finish \| error \| custom string | derived | Overrides the derived status. |
| Step | data | unknown | - | Business metadata returned in change metadata. |

## Change metadata

`meta.previous` and `meta.current` contain the complete semantic node snapshot: `value`, resolved `status`, `disabled`, and optional `data`. `meta.trigger` is `pointer` or `keyboard`.

Angular binds `(change)="handleChange($event)"`; the output payload is `{ value, meta }` because Angular outputs carry one value.

## Controlled and uncontrolled

With `current`, Steps emits navigation requests and the owner updates the value. With `defaultCurrent`, Steps updates itself. Business completion should update controlled `current` directly.

## Keyboard

When `navigation` is enabled, Enter/Space selects; arrows move focus and selection according to orientation; Home/End select the first/last enabled node. Disabled nodes are skipped.

## Composition notes

Keep business panels outside Steps. Use `StepContent` for arbitrary labels and descriptions and `StepIndicator` for project icons or custom nodes. Responsive behavior uses the Steps container, so it also works inside grids and sidebars.
