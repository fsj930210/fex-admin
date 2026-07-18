<script lang="ts">
  import type { ScrollbarAxis } from '@fex/components-core/scrollbar/types'; import { scrollbarBarClassName } from '@fex/components-styles/scrollbar'; import { cn } from '@fex/utils'; import type { Snippet } from 'svelte'; import type { HTMLAttributes } from 'svelte/elements'; import ScrollbarTrack from './scrollbar-track.svelte'; import ScrollbarThumb from './scrollbar-thumb.svelte'
  interface Props extends HTMLAttributes<HTMLDivElement> { axis: ScrollbarAxis; children?: Snippet }
  let { axis, children, class: className, ...rest }: Props = $props()
</script>
<div {...rest} data-slot="scrollbar-bar" data-axis={axis} data-visible="false" class={cn(scrollbarBarClassName({ axis }), className)}>{#if children}{@render children()}{:else}<ScrollbarTrack {axis}><ScrollbarThumb {axis} /></ScrollbarTrack>{/if}</div>
