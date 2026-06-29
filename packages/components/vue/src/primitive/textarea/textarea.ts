import { textareaClassName } from '@fex/components-styles/textarea'
import { cn } from '@fex/utils'
import { defineComponent, h } from 'vue'

export const Textarea = defineComponent({
  name: 'Textarea',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h('textarea', { ...attrs, 'data-slot': 'textarea', class: cn(textareaClassName, attrs.class as string | undefined) })
  },
})
