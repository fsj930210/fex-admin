<script lang="ts">import { timePickerRootClassName } from '@fex/components-styles/time-picker'; import type { Snippet } from 'svelte'; let { children }: { children?: Snippet } = $props()</script>
<div data-slot="time-picker-panel" class={timePickerRootClassName}>{@render children?.()}</div>
