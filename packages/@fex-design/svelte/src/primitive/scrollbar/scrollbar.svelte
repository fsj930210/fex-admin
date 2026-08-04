<script lang="ts">
  import { createScrollbarController } from '@fex-design/core/scrollbar/create-scrollbar-controller'
  import type { ScrollbarAutoHide, ScrollbarClickScroll, ScrollbarVisibility } from '@fex-design/core/scrollbar/types'
  import { scrollbarRootClassName } from '@fex-design/styles/scrollbar'
  import { cn } from '@fex/utils'
  import { onMount, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  interface Props extends HTMLAttributes<HTMLDivElement> { children?: Snippet; visibility?: ScrollbarVisibility; autoHide?: ScrollbarAutoHide; autoHideDelay?: number; dragScroll?: boolean; clickScroll?: ScrollbarClickScroll; minThumbSize?: number; disabled?: boolean; onScrollChange?: (detail: { scrollLeft: number; scrollTop: number }) => void }
  let { children, visibility = 'auto', autoHide = 'scroll', autoHideDelay = 900, dragScroll = true, clickScroll = false, minThumbSize = 24, disabled = false, onScrollChange, class: className, ...rest }: Props = $props()
  let element: HTMLDivElement | undefined = undefined
  onMount(() => element
    ? createScrollbarController({ visibility, autoHide, autoHideDelay, dragScroll, clickScroll, minThumbSize, disabled, onScroll: onScrollChange }).connect(element)
    : undefined)
</script>
<div {...rest} bind:this={element} data-slot="scrollbar-root" class={cn(scrollbarRootClassName, className)}>{@render children?.()}</div>
