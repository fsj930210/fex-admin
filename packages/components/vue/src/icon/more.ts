import { defineComponent, h } from 'vue'

export const EllipsisIcon = defineComponent({
  name: 'EllipsisIcon',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h('svg', { ...attrs, xmlns: 'http://www.w3.org/2000/svg', width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('circle', { cx: '12', cy: '12', r: '1' }),
      h('circle', { cx: '19', cy: '12', r: '1' }),
      h('circle', { cx: '5', cy: '12', r: '1' }),
    ])
  },
})
