<script setup lang="ts">
import {
  getQrCodeCenterExcludeRect,
  getQrCodeModuleCells,
  type QrCodeModuleExcludeRect,
} from '@fex-design/core/qrcode'
import { qrcodeSurfaceClassName } from '@fex-design/styles/qrcode'
import { cn } from '@fex/utils'
import { computed, ref, useAttrs, watchEffect, type StyleValue } from 'vue'
import { useQrCode } from './context'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  centerSize?: number
  exclude?: QrCodeModuleExcludeRect
  class?: string
}>()
const attrs = useAttrs()
const { model } = useQrCode('QrCodeCanvas')
const canvasRef = ref<HTMLCanvasElement | null>(null)
const className = computed(() => cn(qrcodeSurfaceClassName, attrs.class as string | undefined, props.class))
const canvasStyle = computed<StyleValue>(() => [
  { width: model.value.size + 'px', height: model.value.size + 'px' },
  attrs.style as StyleValue,
])

watchEffect(() => {
  const canvas = canvasRef.value
  const context = canvas?.getContext('2d')
  if (!canvas || !context) return

  const current = model.value
  const ratio = window.devicePixelRatio || 1
  const centerExclude = props.centerSize ? getQrCodeCenterExcludeRect(current, props.centerSize) : undefined
  const cells = getQrCodeModuleCells(current, props.exclude ?? centerExclude)
  const moduleSize = current.size / current.viewBoxSize

  canvas.width = current.size * ratio
  canvas.height = current.size * ratio
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
  context.fillStyle = current.bgColor
  context.fillRect(0, 0, current.size, current.size)
  context.fillStyle = current.color
  for (const cell of cells) {
    context.fillRect(cell.x * moduleSize, cell.y * moduleSize, moduleSize, moduleSize)
  }
})
</script>

<template>
  <canvas
    ref="canvasRef"
    v-bind="attrs"
    data-slot="qrcode-canvas"
    :class="className"
    :style="canvasStyle"
  />
</template>
