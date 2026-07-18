<script lang="ts">
  import type { ScrollbarAxis } from '@fex/components-core/scrollbar/types'; import { scrollbarThumbClassName } from '@fex/components-styles/scrollbar'; import { cn } from '@fex/utils'; import type { HTMLAttributes } from 'svelte/elements'
  interface Props extends HTMLAttributes<HTMLDivElement> { axis: ScrollbarAxis }
  let { axis, class: className, ...rest }: Props = $props()
</script>
<div {...rest} data-slot="scrollbar-thumb" class={cn(scrollbarThumbClassName({ axis }), className)}></div>
