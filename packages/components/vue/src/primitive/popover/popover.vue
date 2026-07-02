<script setup lang="ts">
import {
  createFloatingOverlay,
  type FloatingOverlayOptions,
} from '@fex/components-core/overlay/create-floating-overlay'
import type { OverlayTrigger } from '@fex/components-core/overlay/trigger/create-trigger'
import { computed, onBeforeUnmount, provide, ref, shallowRef, watchEffect, type PropType } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import { popoverKey } from './context'

const props = defineProps({
  open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
  defaultOpen: { type: Boolean, default: false },
  trigger: { type: Array as PropType<OverlayTrigger[]>, default: () => ['click'] },
  allowedTriggers: { type: Array as PropType<OverlayTrigger[]>, default: () => ['click', 'hover', 'focus', 'context-menu'] },
  placement: String as PropType<FloatingOverlayOptions['placement']>,
  side: String as PropType<FloatingOverlayOptions['side']>,
  align: String as PropType<FloatingOverlayOptions['align']>,
  sideOffset: { type: Number, default: 6 },
  alignOffset: Number,
  offset: Number,
  strategy: String as PropType<FloatingOverlayOptions['strategy']>,
  avoidCollisions: Boolean as PropType<boolean | undefined>,
  autoAdjustOverflow: Boolean as PropType<boolean | undefined>,
  collisionBoundary: null as unknown as PropType<FloatingOverlayOptions['collisionBoundary']>,
  collisionPadding: null as unknown as PropType<FloatingOverlayOptions['collisionPadding']>,
  arrow: { type: Boolean, default: false },
  arrowPadding: Number,
  matchReferenceWidth: [Boolean, String] as PropType<FloatingOverlayOptions['matchReferenceWidth']>,
  hideWhenDetached: Boolean as PropType<boolean | undefined>,
  zIndex: Number,
  getPopupContainer: Function as PropType<FloatingOverlayOptions['getPopupContainer']>,
  forceMount: Boolean,
  closeDelay: { type: Number, default: 140 },
  modal: Boolean,
  dismiss: { type: Object as PropType<FloatingOverlayOptions['dismiss']>, default: () => ({ escapeKey: true, outsidePointer: true }) },
  hoverOpenDelay: Number,
  hoverCloseDelay: Number,
  disabled: Boolean,
})

const emit = defineEmits<{
  openChange: [open: boolean, info: Parameters<NonNullable<FloatingOverlayOptions['onOpenChange']>>[1]]
}>()

const controlled = computed(() => props.open !== undefined)
// defaultOpen 只作为非受控初始值读取一次；后续开关由 core onOpenChange 回写 localOpen。
// 如果 watch defaultOpen，会把“默认值”误当成受控来源。
const localOpen = ref(props.defaultOpen)
const triggerElement = shallowRef<HTMLElement | null>(null)
const arrowElement = shallowRef<HTMLElement | null>(null)

function getOpen() {
  // Vue adapter 只把受控判断结果传给 core，真正的受控/非受控语义仍由 disclosure 统一处理。
  return controlled.value ? Boolean(props.open) : localOpen.value
}

function createOptions(): FloatingOverlayOptions {
  return {
    open: getOpen(),
    onOpenChange(nextOpen, info) {
      if (!controlled.value) {
        // 非受控模式先更新本地 open，再立即同步 options，让 core 下次 getSnapshot 读到同一来源。
        localOpen.value = nextOpen
        syncOptions()
      }
      emit('openChange', nextOpen, info)
    },
    trigger: props.trigger,
    allowedTriggers: props.allowedTriggers,
    placement: props.placement,
    side: props.side,
    align: props.align,
    sideOffset: props.sideOffset,
    alignOffset: props.alignOffset,
    offset: props.offset,
    strategy: props.strategy,
    avoidCollisions: props.avoidCollisions,
    autoAdjustOverflow: props.autoAdjustOverflow,
    collisionBoundary: props.collisionBoundary,
    collisionPadding: props.collisionPadding,
    arrow: props.arrow,
    arrowPadding: props.arrowPadding,
    matchReferenceWidth: props.matchReferenceWidth,
    hideWhenDetached: props.hideWhenDetached,
    zIndex: props.zIndex,
    getPopupContainer: props.getPopupContainer,
    forceMount: props.forceMount,
    closeDelay: props.closeDelay,
    modal: props.modal,
    dismiss: props.dismiss,
    hoverOpenDelay: props.hoverOpenDelay,
    hoverCloseDelay: props.hoverCloseDelay,
    disabled: props.disabled,
  }
}

const overlay = createFloatingOverlay(createOptions())
const snapshot = useCoreStore(overlay)
// arrow 是 UI 开关，不参与 core 定位语义；使用 shallowRef 避免普通 props 解构丢失响应式。
const arrow = shallowRef(Boolean(props.arrow))

function syncOptions() {
  arrow.value = Boolean(props.arrow)
  overlay.setOptions(createOptions())
}

watchEffect(syncOptions)
// watchEffect 用在这里是为了同步外部 core 实例，这是框架边界副作用。
// 普通业务流转仍然走 onOpenChange/trigger 事件，不靠 watch 串联。
provide(popoverKey, { arrow, arrowElement, overlay, triggerElement, snapshot })

onBeforeUnmount(() => {
  overlay.destroy()
})
</script>

<template>
  <slot />
</template>
