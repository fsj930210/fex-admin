import { defineComponent, h } from 'vue'

export const LoadingIcon = defineComponent({
  name: 'LoadingIcon',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h('svg', { ...attrs, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
      h('path', { d: 'M21 12a9 9 0 1 1-6.219-8.56' }),
    ])
  },
})
