import { createDialogController, type DialogOptions } from '@fex/components-core/dialog/create-dialog-controller'
import { shallowEqualObject } from '@fex/utils'
import { computed, defineComponent, onBeforeUnmount, provide, ref, shallowRef, type PropType } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import { dialogKey } from './context'

let nextDialogId = 1
const defaultDismiss = { escapeKey: true, overlayPointer: true }

export const Dialog = defineComponent({
  name: 'Dialog',
  props: {
    open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    defaultOpen: { type: Boolean, default: false },
    modal: { type: Boolean, default: true },
    forceMount: Boolean,
    closeDelay: { type: Number, default: 140 },
    closeOnOverlayPointer: { type: Boolean, default: true },
    dismiss: { type: Object as PropType<DialogOptions['dismiss']>, default: () => defaultDismiss },
  },
  emits: {
    openChange: (_open: boolean, _info: Parameters<NonNullable<DialogOptions['onOpenChange']>>[1]) => true,
  },
  setup(props, { emit, slots }) {
    const controlled = computed(() => props.open !== undefined)
    const localOpen = ref(props.defaultOpen)
    const triggerElement = shallowRef<HTMLButtonElement | null>(null)
    const dialogId = nextDialogId++

    function getOpen() {
      return controlled.value ? Boolean(props.open) : localOpen.value
    }

    function createOptions(): DialogOptions {
      return {
        open: getOpen(),
        modal: props.modal,
        forceMount: props.forceMount,
        closeDelay: props.closeDelay,
        closeOnOverlayPointer: props.closeOnOverlayPointer,
        dismiss: props.dismiss,
        onOpenChange(nextOpen, info) {
          if (!controlled.value) {
            localOpen.value = nextOpen
            syncOptions()
          }
          emit('openChange', nextOpen, info)
        },
      }
    }

    let latestOptions = createOptions()
    const dialog = createDialogController(latestOptions)
    const snapshot = useCoreStore(dialog)

    function syncOptions() {
      const nextOptions = createOptions()
      if (!shallowEqualObject(latestOptions, nextOptions)) {
        latestOptions = nextOptions
        dialog.setOptions(nextOptions)
      }
    }

    provide(dialogKey, {
      contentId: `fex-dialog-content-${dialogId}`,
      descriptionId: `fex-dialog-description-${dialogId}`,
      dialog,
      snapshot,
      titleId: `fex-dialog-title-${dialogId}`,
      triggerElement,
    })

    onBeforeUnmount(() => dialog.destroy())

    return () => {
      syncOptions()
      return slots.default?.() ?? null
    }
  },
})
