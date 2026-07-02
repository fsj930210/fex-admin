<script setup lang="ts">
import { popoverContentClassName } from '@fex/components-styles/popover'
import { cn } from '@fex/utils'
import type { ComponentPublicInstance } from 'vue'
import { computed, onBeforeUnmount, shallowRef, watchEffect } from 'vue'
import { dismissOpenPopovers, eventInfo, registerPopoverDismissRecord } from './context'
import { usePopoverContext } from './context'

defineOptions({ inheritAttrs: false })

const props = defineProps<{ class?: string }>()
const { arrowElement, overlay, snapshot, triggerElement } = usePopoverContext('PopoverContent')
const contentElement = shallowRef<HTMLDivElement | null>(null)
let cleanupDismiss: (() => void) | undefined

const contentClass = computed(() => cn(popoverContentClassName(), props.class))
// 定位值来自 core 写到 DOM 的 CSS 变量，Vue 不直接订阅 x/y。
// 这样滚动、resize、autoUpdate 只改 DOM 变量，不会导致 Vue 模板反复渲染。
const contentStyle = computed<Record<string, string>>(() => ({
  position: 'var(--floating-strategy, absolute)',
  left: 'var(--floating-x, 0px)',
  top: 'var(--floating-y, 0px)',
  transformOrigin: 'var(--floating-transform-origin)',
}))
const unregisterDismissRecord = registerPopoverDismissRecord({
  overlay,
  triggerElement,
  getContentElement: () => contentElement.value,
  getArrowElement: () => arrowElement.value,
})

function setContentElement(element: Element | ComponentPublicInstance | null) {
  // Vue ref 可能拿到组件实例或 Element，这里只把真实 HTMLDivElement 交给 core。
  // 如果把组件实例传给 Floating UI，computePosition 会因为缺少 DOM API 失败。
  contentElement.value = element instanceof HTMLDivElement ? element : null
  overlay.setFloatingElement(contentElement.value)
}

function setupDismiss() {
  cleanupDismiss?.()
  const floatingElement = contentElement.value
  if (!snapshot.value.open || !floatingElement) {
    cleanupDismiss = undefined
    return
  }

  // 监听浮层所属 document，支持 Teleport 到自定义容器或 iframe。
  // 这里必须读取 snapshot.value.open，不能提前解构 open，否则 Vue 不会重新执行清理/绑定。
  const ownerDocument = floatingElement.ownerDocument
  const handlePointerDown = (event: PointerEvent) => {
    dismissOpenPopovers(event)
  }
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      overlay.dismiss.escapeKey(eventInfo(event))
    }
  }

  ownerDocument.addEventListener('pointerdown', handlePointerDown, true)
  ownerDocument.addEventListener('keydown', handleKeyDown, true)
  cleanupDismiss = () => {
    ownerDocument.removeEventListener('pointerdown', handlePointerDown, true)
    ownerDocument.removeEventListener('keydown', handleKeyDown, true)
  }
}

function handlePointerEnter(event: PointerEvent) {
  overlay.content.pointerEnter(eventInfo(event))
}

function handlePointerLeave(event: PointerEvent) {
  overlay.content.pointerLeave(eventInfo(event))
}

watchEffect(setupDismiss)
// watchEffect 只负责 document 监听这个外部系统；开关逻辑仍由 trigger/onOpenChange 事件驱动。
onBeforeUnmount(() => {
  cleanupDismiss?.()
  unregisterDismissRecord()
  overlay.setFloatingElement(null)
})
</script>

<template>
  <div
    v-if="snapshot.mounted"
    :ref="setContentElement"
    role="dialog"
    tabindex="-1"
    data-slot="popover-content"
    :data-state="snapshot.open ? 'open' : 'closed'"
    :data-phase="snapshot.phase"
    :data-side="snapshot.side"
    :data-align="snapshot.align"
    :data-placement="snapshot.placement"
    :class="contentClass"
    :style="contentStyle"
    @pointerenter="handlePointerEnter"
    @pointerleave="handlePointerLeave"
  >
    <slot />
  </div>
</template>
