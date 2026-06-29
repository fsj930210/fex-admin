import { alertActionClassName, alertClassName, alertDescriptionClassName, alertTitleClassName, type AlertStyleProps } from '@fex/components-styles/alert'
import { cn } from '@fex/utils'
import { defineComponent, h, type PropType } from 'vue'

function createAlertPart(name: string, slot: string, className: string) {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => h('div', { ...attrs, 'data-slot': slot, class: cn(className, attrs.class as string | undefined) }, slots.default?.())
    },
  })
}

export const Alert = defineComponent({
  name: 'Alert',
  inheritAttrs: false,
  props: { variant: String as PropType<AlertStyleProps['variant']> },
  setup(props, { attrs, slots }) {
    return () => h('div', { ...attrs, 'data-slot': 'alert', role: 'alert', class: cn(alertClassName({ variant: props.variant }), attrs.class as string | undefined) }, slots.default?.())
  },
})

export const AlertTitle = createAlertPart('AlertTitle', 'alert-title', alertTitleClassName)
export const AlertDescription = createAlertPart('AlertDescription', 'alert-description', alertDescriptionClassName)
export const AlertAction = createAlertPart('AlertAction', 'alert-action', alertActionClassName)
