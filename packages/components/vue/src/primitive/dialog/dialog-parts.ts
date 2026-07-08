import {
  dialogBodyClassName,
  dialogDescriptionClassName,
  dialogFooterClassName,
  dialogHeaderClassName,
  dialogTitleClassName,
} from '@fex/components-styles/dialog'
import { cn } from '@fex/utils'
import { defineComponent, h } from 'vue'
import { useDialogContext } from './context'

function createPart(name: string, tag: string, slot: string, className: string) {
  return defineComponent({
    name,
    props: { class: String },
    setup(props, { attrs, slots }) {
      return () =>
        h(tag, { ...attrs, 'data-slot': slot, class: cn(className, props.class) }, slots.default?.())
    },
  })
}

export const DialogHeader = createPart('DialogHeader', 'div', 'dialog-header', dialogHeaderClassName)
export const DialogBody = createPart('DialogBody', 'div', 'dialog-body', dialogBodyClassName)
export const DialogFooter = createPart('DialogFooter', 'div', 'dialog-footer', dialogFooterClassName)

export const DialogTitle = defineComponent({
  name: 'DialogTitle',
  props: { class: String },
  setup(props, { attrs, slots }) {
    const { titleId } = useDialogContext('DialogTitle')
    return () =>
      h('h2', { ...attrs, id: titleId, 'data-slot': 'dialog-title', class: cn(dialogTitleClassName, props.class) }, slots.default?.())
  },
})

export const DialogDescription = defineComponent({
  name: 'DialogDescription',
  props: { class: String },
  setup(props, { attrs, slots }) {
    const { descriptionId } = useDialogContext('DialogDescription')
    return () =>
      h('p', { ...attrs, id: descriptionId, 'data-slot': 'dialog-description', class: cn(dialogDescriptionClassName, props.class) }, slots.default?.())
  },
})
