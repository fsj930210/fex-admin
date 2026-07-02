<script setup lang="ts">
import { popoverArrowClassName } from '@fex/components-styles/popover'
import { cn } from '@fex/utils'
import type { ComponentPublicInstance, HTMLAttributes } from 'vue'
import { computed, onBeforeUnmount } from 'vue'
import { usePopoverContext } from './context'

const props = defineProps<{ class?: string; style?: HTMLAttributes['style'] }>()
const { arrow, arrowElement, overlay, snapshot } = usePopoverContext('PopoverArrow')
const arrowClass = computed(() => cn(popoverArrowClassName, props.class))
const arrowStyle = computed(() => {
  // 必须在 computed 中读取 snapshot.value.side，确保 Vue 建立响应式依赖。
  // 如果 const side = snapshot.value.side 后再使用，console 可能看到 core 已更新，但 DOM 箭头仍是旧方向。
  const sideStyle =
    snapshot.value.side === 'left' || snapshot.value.side === 'right'
      ? {
          top: 'clamp(var(--popover-arrow-inset,32px), var(--floating-arrow-y,50%), calc(100% - var(--popover-arrow-inset,32px)))',
        }
      : {
          left: 'clamp(var(--popover-arrow-inset,32px), var(--floating-arrow-x,50%), calc(100% - var(--popover-arrow-inset,32px)))',
        }

  return {
    ...sideStyle,
    ...(typeof props.style === 'object' && props.style ? props.style : undefined),
  }
})

function setArrowElement(element: Element | ComponentPublicInstance | null) {
  // arrow 也是 Floating UI middleware 的输入，不只是展示 DOM。
  // ref 更新后必须同步给 core，才能重新计算 --floating-arrow-x/y。
  arrowElement.value = element instanceof HTMLDivElement ? element : null
  overlay.setArrowElement(arrowElement.value)
}

onBeforeUnmount(() => {
  arrowElement.value = null
  overlay.setArrowElement(null)
})
</script>

<template>
  <div
    v-if="arrow"
    :ref="setArrowElement"
    data-slot="popover-arrow"
    :data-side="snapshot.side"
    :class="arrowClass"
    :style="arrowStyle"
  />
</template>
