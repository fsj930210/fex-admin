import { defineComponent, h } from 'vue'

export const MinusIcon = defineComponent({
  name: 'MinusIcon',
  setup(_, { attrs }) {
    return () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          width: '24',
          height: '24',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': '2',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          class: 'lucide lucide-minus-icon lucide-minus',
          ...attrs,
        },
        [h('path', { d: 'M5 12h14' })],
      )
  },
})
