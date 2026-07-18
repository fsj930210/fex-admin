import { createScrollbarController } from '@fex/components-core/scrollbar/create-scrollbar-controller'
import type { ScrollbarAxis, ScrollbarAutoHide, ScrollbarClickScroll, ScrollbarScrollDetail, ScrollbarVisibility } from '@fex/components-core/scrollbar/types'
import { scrollbarBarClassName, scrollbarCornerClassName, scrollbarRootClassName, scrollbarThumbClassName, scrollbarTrackClassName, scrollbarViewportClassName } from '@fex/components-styles/scrollbar'
import { cn } from '@fex/utils'
import { createContext, use, useEffect, useEffectEvent, useRef, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { useComposedRef } from '../../hooks/use-composed-ref'

type Overflow = 'auto' | 'hidden'
type ScrollbarContextValue = { rootRef: { current: HTMLDivElement | null }; overflow?: { x?: Overflow; y?: Overflow } | undefined }
const ScrollbarContext = createContext<ScrollbarContextValue | null>(null)

export interface ScrollbarRootProps extends HTMLAttributes<HTMLDivElement> {
  overflow?: { x?: Overflow; y?: Overflow }
  visibility?: ScrollbarVisibility
  autoHide?: ScrollbarAutoHide
  autoHideDelay?: number
  dragScroll?: boolean
  clickScroll?: ScrollbarClickScroll
  minThumbSize?: number
  disabled?: boolean
  ref?: Ref<HTMLDivElement>
  onScrollChange?: (detail: ScrollbarScrollDetail) => void
}

export function ScrollbarRoot({ overflow, visibility, autoHide, autoHideDelay, dragScroll, clickScroll, minThumbSize, disabled, onScrollChange, className, ref, children, ...props }: ScrollbarRootProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const composedRef = useComposedRef(rootRef, ref)
  const emitScrollChange = useEffectEvent((detail: ScrollbarScrollDetail) => onScrollChange?.(detail))
  // This effect only connects the controller to DOM nodes; scroll frames update Thumb styles imperatively.
  useEffect(() => {
    if (!rootRef.current) return
    const controller = createScrollbarController({ visibility, autoHide, autoHideDelay, dragScroll, clickScroll, minThumbSize, disabled, onScroll: emitScrollChange })
    return controller.connect(rootRef.current)
  }, [visibility, autoHide, autoHideDelay, dragScroll, clickScroll, minThumbSize, disabled])

  return <ScrollbarContext value={{ rootRef, overflow }}><div {...props} ref={composedRef} data-slot="scrollbar-root" className={cn(scrollbarRootClassName, className)}>{children}</div></ScrollbarContext>
}

export interface ScrollbarViewportProps extends HTMLAttributes<HTMLDivElement> {
  overflow?: { x?: Overflow; y?: Overflow }
  ref?: Ref<HTMLDivElement>
}

export function ScrollbarViewport({ overflow, className, ref, ...props }: ScrollbarViewportProps) {
  const context = use(ScrollbarContext)
  if (!context) throw new Error('ScrollbarViewport must be used inside ScrollbarRoot.')
  const resolvedOverflow = overflow ?? context.overflow
  return <div {...props} ref={ref} data-slot="scrollbar-viewport" className={cn(scrollbarViewportClassName({ overflowX: resolvedOverflow?.x, overflowY: resolvedOverflow?.y }), className)} />
}

export interface ScrollbarBarProps extends HTMLAttributes<HTMLDivElement> { axis: ScrollbarAxis; children?: ReactNode }
export function ScrollbarBar({ axis, className, children, ...props }: ScrollbarBarProps) {
  const context = use(ScrollbarContext)
  if (!context) throw new Error('ScrollbarBar must be used inside ScrollbarRoot.')
  return <div {...props} data-slot="scrollbar-bar" data-axis={axis} data-visible="false" className={cn(scrollbarBarClassName({ axis }), className)}>{children ?? <ScrollbarTrack axis={axis}><ScrollbarThumb axis={axis} /></ScrollbarTrack>}</div>
}

export interface ScrollbarTrackProps extends HTMLAttributes<HTMLDivElement> { axis: ScrollbarAxis }
export function ScrollbarTrack({ axis, className, ...props }: ScrollbarTrackProps) { return <div {...props} data-slot="scrollbar-track" className={cn(scrollbarTrackClassName, className)} /> }

export interface ScrollbarThumbProps extends HTMLAttributes<HTMLDivElement> { axis: ScrollbarAxis }
export function ScrollbarThumb({ axis, className, ...props }: ScrollbarThumbProps) { return <div {...props} data-slot="scrollbar-thumb" className={cn(scrollbarThumbClassName({ axis }), className)} /> }

export function ScrollbarCorner({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div {...props} data-slot="scrollbar-corner" className={cn(scrollbarCornerClassName, className)} /> }
