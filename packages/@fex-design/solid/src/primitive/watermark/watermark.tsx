import { createWatermarkController } from '@fex-design/core/watermark/create-watermark-controller'
import type { WatermarkOptions } from '@fex-design/core/watermark/types'
import { watermarkRootClassName } from '@fex-design/styles/watermark'
import { cn } from '@fex/utils'
import { createEffect, onCleanup, splitProps, type JSX, type ParentProps } from 'solid-js'

type WatermarkProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement> & WatermarkOptions>

export function Watermark(props: WatermarkProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
    'content',
    'width',
    'height',
    'rotate',
    'gap',
    'offset',
    'zIndex',
    'opacity',
    'font',
  ])
  let root: HTMLDivElement | undefined

  createEffect(() => {
    if (!root) return
    const options: WatermarkOptions = {}
    if (local.content !== undefined) options.content = local.content
    if (local.width !== undefined) options.width = local.width
    if (local.height !== undefined) options.height = local.height
    if (local.rotate !== undefined) options.rotate = local.rotate
    if (local.gap !== undefined) options.gap = local.gap
    if (local.offset !== undefined) options.offset = local.offset
    if (local.zIndex !== undefined) options.zIndex = local.zIndex
    if (local.opacity !== undefined) options.opacity = local.opacity
    if (local.font !== undefined) options.font = local.font
    const controller = createWatermarkController(options)
    const cleanup = controller.connect(root)
    onCleanup(cleanup)
  })

  return (
    <div
      {...rest}
      ref={root}
      data-slot="watermark-root"
      class={cn(watermarkRootClassName, local.class)}
    >
      {local.children}
    </div>
  )
}
