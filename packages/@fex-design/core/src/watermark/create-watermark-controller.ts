import { createWatermarkImage, resolveWatermarkOptions } from './create-watermark-image'
import type { WatermarkController, WatermarkOptions } from './types'

export type {
  ResolvedWatermarkOptions,
  WatermarkContent,
  WatermarkController,
  WatermarkFont,
  WatermarkOptions,
} from './types'

export function createWatermarkController(input: WatermarkOptions = {}): WatermarkController {
  let options = resolveWatermarkOptions(input)
  let target: HTMLElement | undefined
  let layer: HTMLDivElement | undefined
  let observer: MutationObserver | undefined
  let version = 0
  let restoring = false

  const ensureLayer = () => {
    if (!target) return undefined
    if (!layer) {
      layer = document.createElement('div')
      layer.dataset.slot = 'watermark'
      layer.setAttribute('aria-hidden', 'true')
      layer.style.position = 'absolute'
      layer.style.inset = '0'
      layer.style.pointerEvents = 'none'
      layer.style.backgroundRepeat = 'repeat'
    }
    if (!layer.isConnected && !restoring) {
      restoring = true
      target.appendChild(layer)
      restoring = false
    }
    return layer
  }

  const render = async () => {
    const currentVersion = ++version
    const currentLayer = ensureLayer()
    if (!currentLayer) return
    const dataUrl = await createWatermarkImage(options)
    if (currentVersion !== version || !layer) return
    currentLayer.style.zIndex = String(options.zIndex)
    currentLayer.style.backgroundImage = dataUrl ? `url(${dataUrl})` : ''
    currentLayer.style.backgroundSize = `${options.width + options.gap[0]}px ${options.height + options.gap[1]}px`
    currentLayer.style.backgroundPosition = `${options.offset[0]}px ${options.offset[1]}px`
  }

  const restore = () => {
    if (!target || !layer || restoring || layer.isConnected) return
    restoring = true
    target.appendChild(layer)
    restoring = false
  }

  return {
    connect(nextTarget) {
      this.destroy()
      target = nextTarget
      const computed = window.getComputedStyle(target)
      if (computed.position === 'static') {
        target.style.position = 'relative'
      }
      target.style.overflow = target.style.overflow || 'hidden'
      render()
      observer = new MutationObserver((mutations) => {
        if (!layer) return
        for (const mutation of mutations) {
          for (const removedNode of mutation.removedNodes) {
            if (removedNode === layer) {
              restore()
              return
            }
          }
        }
      })
      observer.observe(target, { childList: true })
      return () => this.destroy()
    },
    update(nextOptions) {
      options = resolveWatermarkOptions(nextOptions)
      render()
    },
    destroy() {
      version += 1
      observer?.disconnect()
      observer = undefined
      layer?.remove()
      layer = undefined
      target = undefined
    },
  }
}
