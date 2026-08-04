<script lang="ts">import type { Snippet } from 'svelte'; let { children }: { children?: Snippet } = $props()</script>
<div role="group" data-slot="menu-list">{@render children?.()}</div>
