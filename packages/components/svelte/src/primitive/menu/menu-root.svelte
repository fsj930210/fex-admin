<script lang="ts">import type { Snippet } from 'svelte'; let { children }: { children?: Snippet } = $props()</script>
<div role="menu" data-slot="menu">{@render children?.()}</div>
