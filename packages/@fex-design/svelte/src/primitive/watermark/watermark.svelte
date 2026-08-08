<script lang="ts">
  import { createWatermarkController } from '@fex-design/core/watermark/create-watermark-controller'
  import type { WatermarkOptions } from '@fex-design/core/watermark/types'
  import { watermarkRootClassName } from '@fex-design/styles/watermark'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'>, WatermarkOptions {
    class?: string
    children?: Snippet
  }

  let {
    class: className,
    children,
    content,
    width,
    height,
    rotate,
    gap,
    offset,
    zIndex,
    opacity,
    font,
    ...rest
  }: Props = $props()
  let root: HTMLDivElement
  const rootClassName = $derived(cn(watermarkRootClassName, className))
  const options = $derived.by(() => {
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
  })

  $effect(() => {
    if (!root) return
    const controller = createWatermarkController(options)
    return controller.connect(root)
  })
</script>

<div {...rest} bind:this={root} data-slot="watermark-root" class={rootClassName}>
  {@render children?.()}
</div>
