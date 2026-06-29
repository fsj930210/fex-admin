import { inputClassName } from '@fex/components-styles/input'
import { cn } from '@fex/utils'
import { defineComponent, h } from 'vue'

export const Input = defineComponent({
  name: 'Input',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h('input', { ...attrs, 'data-slot': 'input', class: cn(inputClassName, attrs.class as string | undefined) })
  },
})
