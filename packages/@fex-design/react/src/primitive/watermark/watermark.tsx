import { createWatermarkController } from '@fex-design/core/watermark/create-watermark-controller'
import type { WatermarkOptions } from '@fex-design/core/watermark/types'
import { watermarkRootClassName } from '@fex-design/styles/watermark'
import { cn } from '@fex/utils'
import { useEffect, useMemo, useRef, type HTMLAttributes, type Ref } from 'react'
import { useComposedRef } from '../../hooks/use-composed-ref'

export interface WatermarkProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'content'>,
    WatermarkOptions {
  ref?: Ref<HTMLDivElement>
}

export function Watermark({
  content,
  width,
  height,
  rotate,
  gap,
  offset,
  zIndex,
  opacity,
  font,
  className,
  ref,
  children,
  ...props
}: WatermarkProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const composedRef = useComposedRef(rootRef, ref)
  const options = useMemo<WatermarkOptions>(() => {
    const nextOptions: WatermarkOptions = {}
    if (content !== undefined) nextOptions.content = content
    if (width !== undefined) nextOptions.width = width
    if (height !== undefined) nextOptions.height = height
    if (rotate !== undefined) nextOptions.rotate = rotate
    if (gap !== undefined) nextOptions.gap = gap
    if (offset !== undefined) nextOptions.offset = offset
    if (zIndex !== undefined) nextOptions.zIndex = zIndex
    if (opacity !== undefined) nextOptions.opacity = opacity
    if (font !== undefined) nextOptions.font = font
    return nextOptions
  }, [content, width, height, rotate, gap, offset, zIndex, opacity, font])

  useEffect(() => {
    if (!rootRef.current) return
    const controller = createWatermarkController(options)
    return controller.connect(rootRef.current)
  }, [options])

  return (
    <div
      {...props}
      ref={composedRef}
      data-slot="watermark-root"
      className={cn(watermarkRootClassName, className)}
    >
      {children}
    </div>
  )
}
