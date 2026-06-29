import { kbdClassName, kbdGroupClassName } from '@fex/components-styles/kbd'
import { cn } from '@fex/utils'
import { defineComponent, h } from 'vue'

export const Kbd = defineComponent({
  name: 'Kbd',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h('kbd', { ...attrs, 'data-slot': 'kbd', class: cn(kbdClassName, attrs.class as string | undefined) }, slots.default?.())
  },
})

export const KbdGroup = defineComponent({
  name: 'KbdGroup',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h('div', { ...attrs, 'data-slot': 'kbd-group', class: cn(kbdGroupClassName, attrs.class as string | undefined) }, slots.default?.())
  },
})
