import { defineComponent, h } from 'vue'

export const ChevronRightIcon = defineComponent({
  name: 'ChevronRightIcon',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h('svg', { ...attrs, xmlns: 'http://www.w3.org/2000/svg', width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('path', { d: 'm9 18 6-6-6-6' })])
  },
})

export const ChevronLeftIcon = defineComponent({
  name: 'ChevronLeftIcon',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h(ChevronRightIcon, { ...attrs, class: ['rotate-180', attrs.class] })
  },
})
