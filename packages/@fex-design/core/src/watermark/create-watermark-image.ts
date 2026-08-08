import type { ResolvedWatermarkOptions, WatermarkOptions } from './types'

const defaultFont: Required<ResolvedWatermarkOptions['font']> = {
  color: 'rgba(0, 0, 0, 0.15)',
  fontFamily: 'sans-serif',
  fontSize: 16,
  fontStyle: 'normal',
  fontWeight: 'normal',
}

export function resolveWatermarkOptions(options: WatermarkOptions): ResolvedWatermarkOptions {
  const content =
    typeof options.content === 'string'
      ? [options.content]
      : options.content?.filter((item) => item.length > 0)
  return {
    content,
    width: options.width ?? 120,
    height: options.height ?? 64,
    rotate: options.rotate ?? -22,
    gap: options.gap ?? [100, 100],
    offset: options.offset ?? [0, 0],
    zIndex: options.zIndex ?? 9,
    opacity: options.opacity ?? 1,
    font: { ...defaultFont, ...options.font },
  }
}

function drawText(context: CanvasRenderingContext2D, options: ResolvedWatermarkOptions) {
  if (!options.content?.length) return
  const { font } = options
  context.fillStyle = font.color
  context.font = `${font.fontStyle} ${font.fontWeight} ${font.fontSize}px ${font.fontFamily}`
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  const lineHeight = font.fontSize + 4
  const startY = options.height / 2 - ((options.content.length - 1) * lineHeight) / 2
  options.content.forEach((line, index) => {
    context.fillText(line, options.width / 2, startY + index * lineHeight)
  })
}

export async function createWatermarkImage(options: ResolvedWatermarkOptions) {
  const canvas = document.createElement('canvas')
  const ratio = window.devicePixelRatio || 1
  const tileWidth = options.width + options.gap[0]
  const tileHeight = options.height + options.gap[1]
  canvas.width = tileWidth * ratio
  canvas.height = tileHeight * ratio
  canvas.style.width = `${tileWidth}px`
  canvas.style.height = `${tileHeight}px`
  const context = canvas.getContext('2d')
  if (!context) return ''

  context.scale(ratio, ratio)
  context.globalAlpha = options.opacity
  context.translate(options.width / 2, options.height / 2)
  context.rotate((Math.PI / 180) * options.rotate)
  context.translate(-options.width / 2, -options.height / 2)

  drawText(context, options)

  try {
    return canvas.toDataURL()
  } catch {
    return ''
  }
}
