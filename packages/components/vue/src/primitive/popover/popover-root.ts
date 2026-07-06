import {
  createFloatingOverlay,
  type FloatingOverlayOptions,
} from '@fex/components-core/overlay/create-floating-overlay'
import type { OverlayTrigger } from '@fex/components-core/overlay/trigger/create-trigger'
import { shallowEqualObject } from '@fex/utils'
import { computed, defineComponent, onBeforeUnmount, provide, ref, shallowRef, type PropType } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import { popoverKey } from './context'

const defaultDismiss = { escapeKey: true, outsidePointer: true }

export const Popover = defineComponent({
  name: 'Popover',
  props: {
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
    dismiss: { type: Object as PropType<FloatingOverlayOptions['dismiss']>, default: () => defaultDismiss },
    hoverOpenDelay: Number,
    hoverCloseDelay: Number,
    disabled: Boolean,
  },
  emits: {
    openChange: (_open: boolean, _info: Parameters<NonNullable<FloatingOverlayOptions['onOpenChange']>>[1]) => true,
  },
  setup(props, { emit, slots }) {
    const controlled = computed(() => props.open !== undefined)
    const localOpen = ref(props.defaultOpen)
    const triggerElement = shallowRef<HTMLElement | null>(null)
    const arrowElement = shallowRef<HTMLElement | null>(null)
    const arrow = shallowRef(Boolean(props.arrow))

    function getOpen() {
      return controlled.value ? Boolean(props.open) : localOpen.value
    }

    function createOptions(): FloatingOverlayOptions {
      return {
        open: getOpen(),
        onOpenChange(nextOpen, info) {
          if (!controlled.value) {
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

    let latestOptions = createOptions()
    const overlay = createFloatingOverlay(latestOptions)
    const snapshot = useCoreStore(overlay)

    function syncOptions() {
      const nextOptions = createOptions()
      arrow.value = Boolean(props.arrow)
      if (!shallowEqualObject(latestOptions, nextOptions)) {
        latestOptions = nextOptions
        overlay.setOptions(nextOptions)
      }
    }

    provide(popoverKey, { arrow, arrowElement, overlay, triggerElement, snapshot })

    onBeforeUnmount(() => {
      overlay.destroy()
    })

    return () => {
      syncOptions()
      return slots.default?.() ?? null
    }
  },
})
