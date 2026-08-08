<script lang="ts">
  import {
    getQrCodeCenterExcludeRect,
    getQrCodeModuleCells,
    type QrCodeModuleExcludeRect,
  } from '@fex-design/core/qrcode'
  import { qrcodeSurfaceClassName } from '@fex-design/styles/qrcode'
  import { cn } from '@fex/utils'
  import type { HTMLCanvasAttributes } from 'svelte/elements'
  import { useQrCode } from './context'

  interface Props extends Omit<HTMLCanvasAttributes, 'class'> {
    centerSize?: number
    exclude?: QrCodeModuleExcludeRect
    class?: string
  }

  let { centerSize, exclude, class: className, style, ...rest }: Props = $props()
  const { getModel } = useQrCode('QrCodeCanvas')
  const model = $derived(getModel())
  const classList = $derived(cn(qrcodeSurfaceClassName, className))
  const canvasStyle = $derived('width:' + model.size + 'px;height:' + model.size + 'px;' + (style ?? ''))
  let canvasRef: HTMLCanvasElement | undefined

  $effect(() => {
    const canvas = canvasRef
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const ratio = window.devicePixelRatio || 1
    const centerExclude = centerSize ? getQrCodeCenterExcludeRect(model, centerSize) : undefined
    const cells = getQrCodeModuleCells(model, exclude ?? centerExclude)
    const moduleSize = model.size / model.viewBoxSize

    canvas.width = model.size * ratio
    canvas.height = model.size * ratio
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.fillStyle = model.bgColor
    context.fillRect(0, 0, model.size, model.size)
    context.fillStyle = model.color
    for (const cell of cells) {
      context.fillRect(cell.x * moduleSize, cell.y * moduleSize, moduleSize, moduleSize)
    }
  })
</script>

<canvas
  bind:this={canvasRef}
  {...rest}
  data-slot="qrcode-canvas"
  class={classList}
  style={canvasStyle}
></canvas>
