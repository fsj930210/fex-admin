<script setup lang="ts">
  import { createWatermarkController } from '@fex-design/core/watermark/create-watermark-controller'
  import type {
    WatermarkContent,
    WatermarkFont,
    WatermarkOptions,
  } from '@fex-design/core/watermark/types'
  import { watermarkRootClassName } from '@fex-design/styles/watermark'
  import { cn } from '@fex/utils'
  import { computed, onBeforeUnmount, ref, watch } from 'vue'

  interface Props {
    class?: string
    content?: WatermarkContent
    width?: number
    height?: number
    rotate?: number
    gap?: [number, number]
    offset?: [number, number]
    zIndex?: number
    opacity?: number
    font?: WatermarkFont
  }

  const props = defineProps<Props>()
  const rootRef = ref<HTMLElement>()
  let cleanup: (() => void) | undefined
  const className = computed(() => cn(watermarkRootClassName, props.class))
  const options = computed<WatermarkOptions>(() => {
    const nextOptions: WatermarkOptions = {}
    if (props.content !== undefined) nextOptions.content = props.content
    if (props.width !== undefined) nextOptions.width = props.width
    if (props.height !== undefined) nextOptions.height = props.height
    if (props.rotate !== undefined) nextOptions.rotate = props.rotate
    if (props.gap !== undefined) nextOptions.gap = props.gap
    if (props.offset !== undefined) nextOptions.offset = props.offset
    if (props.zIndex !== undefined) nextOptions.zIndex = props.zIndex
    if (props.opacity !== undefined) nextOptions.opacity = props.opacity
    if (props.font !== undefined) nextOptions.font = props.font
    return nextOptions
  })

  watch(
    [rootRef, options],
    ([root, nextOptions]) => {
      cleanup?.()
      if (!root) return
      cleanup = createWatermarkController(nextOptions).connect(root)
    },
    { immediate: true },
  )

  onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div ref="rootRef" data-slot="watermark-root" :class="className">
    <slot />
  </div>
</template>
