<script lang="ts">import type { SVGAttributes } from 'svelte/elements'; import ChevronsRight from './chevrons-right.svelte'; let { class: className, ...rest }: SVGAttributes<SVGSVGElement> = $props()</script>
<ChevronsRight {...rest} class={`rotate-180 ${className ?? ''}`}/>
