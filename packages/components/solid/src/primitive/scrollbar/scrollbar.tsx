import { createScrollbarController } from '@fex/components-core/scrollbar/create-scrollbar-controller'
import type { ScrollbarAxis, ScrollbarAutoHide, ScrollbarClickScroll, ScrollbarVisibility } from '@fex/components-core/scrollbar/types'
import { scrollbarBarClassName, scrollbarCornerClassName, scrollbarRootClassName, scrollbarThumbClassName, scrollbarTrackClassName, scrollbarViewportClassName } from '@fex/components-styles/scrollbar'
import { cn } from '@fex/utils'
import { onCleanup, onMount, splitProps, type JSX, type ParentProps } from 'solid-js'

type Overflow = 'auto' | 'hidden'
export interface ScrollbarRootProps extends ParentProps<JSX.HTMLAttributes<HTMLDivElement>> { visibility?: ScrollbarVisibility; autoHide?: ScrollbarAutoHide; autoHideDelay?: number; dragScroll?: boolean; clickScroll?: ScrollbarClickScroll; minThumbSize?: number; disabled?: boolean; onScrollChange?: (detail: { scrollLeft: number; scrollTop: number }) => void }
export function ScrollbarRoot(props: ScrollbarRootProps) {
  const [local, rest] = splitProps(props, ['class', 'children', 'visibility', 'autoHide', 'autoHideDelay', 'dragScroll', 'clickScroll', 'minThumbSize', 'disabled', 'onScrollChange'])
  let element: HTMLDivElement | undefined
  onMount(() => {
    if (!element) return
    const controller = createScrollbarController({ visibility: local.visibility, autoHide: local.autoHide, autoHideDelay: local.autoHideDelay, dragScroll: local.dragScroll, clickScroll: local.clickScroll, minThumbSize: local.minThumbSize, disabled: local.disabled, onScroll: local.onScrollChange })
    const cleanup = controller.connect(element)
    onCleanup(cleanup)
  })
  return <div {...rest} ref={element} data-slot="scrollbar-root" class={cn(scrollbarRootClassName, local.class)}>{local.children}</div>
}
export interface ScrollbarViewportProps extends ParentProps<JSX.HTMLAttributes<HTMLDivElement>> { overflowX?: Overflow; overflowY?: Overflow }
export function ScrollbarViewport(props: ScrollbarViewportProps) { const [local, rest] = splitProps(props, ['class', 'children', 'overflowX', 'overflowY']); return <div {...rest} data-slot="scrollbar-viewport" class={cn(scrollbarViewportClassName({ overflowX: local.overflowX, overflowY: local.overflowY }), local.class)}>{local.children}</div> }
export interface ScrollbarBarProps extends ParentProps<JSX.HTMLAttributes<HTMLDivElement>> { axis: ScrollbarAxis }
export function ScrollbarBar(props: ScrollbarBarProps) { const [local, rest] = splitProps(props, ['class', 'children', 'axis']); return <div {...rest} data-slot="scrollbar-bar" data-axis={local.axis} data-visible="false" class={cn(scrollbarBarClassName({ axis: local.axis }), local.class)}>{local.children ?? <ScrollbarTrack axis={local.axis}><ScrollbarThumb axis={local.axis} /></ScrollbarTrack>}</div> }
export function ScrollbarTrack(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>> & { axis: ScrollbarAxis }) { const [local, rest] = splitProps(props, ['class', 'children', 'axis']); return <div {...rest} data-slot="scrollbar-track" class={cn(scrollbarTrackClassName, local.class)}>{local.children}</div> }
export function ScrollbarThumb(props: JSX.HTMLAttributes<HTMLDivElement> & { axis: ScrollbarAxis }) { const [local, rest] = splitProps(props, ['class', 'axis']); return <div {...rest} data-slot="scrollbar-thumb" class={cn(scrollbarThumbClassName({ axis: local.axis }), local.class)} /> }
export function ScrollbarCorner(props: JSX.HTMLAttributes<HTMLDivElement>) { const [local, rest] = splitProps(props, ['class']); return <div {...rest} data-slot="scrollbar-corner" class={cn(scrollbarCornerClassName, local.class)} /> }
