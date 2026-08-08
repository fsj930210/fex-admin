<script lang="ts">import type { HTMLAttributes } from 'svelte/elements';let{...rest}:HTMLAttributes<HTMLDivElement>=$props()</script>
<div {...rest} role={rest.role ?? 'separator'} data-slot="menu-divider"></div>
