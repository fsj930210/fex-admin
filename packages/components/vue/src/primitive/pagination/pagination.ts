import { paginationClassName, paginationContentClassName, paginationEllipsisClassName, paginationLinkClassName, paginationSrOnlyClassName, paginationTextClassName, paginationTextLinkClassName } from '@fex/components-styles/pagination'
import { cn } from '@fex/utils'
import { defineComponent, h, type PropType } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '../../icon/chevron'
import { EllipsisIcon } from '../../icon/more'

export const Pagination = defineComponent({
  name: 'Pagination',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h('nav', { ...attrs, role: 'navigation', 'aria-label': 'pagination', 'data-slot': 'pagination', class: cn(paginationClassName, attrs.class as string | undefined) }, slots.default?.())
  },
})

export const PaginationContent = defineComponent({
  name: 'PaginationContent',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h('ul', { ...attrs, 'data-slot': 'pagination-content', class: cn(paginationContentClassName, attrs.class as string | undefined) }, slots.default?.())
  },
})

export const PaginationItem = defineComponent({
  name: 'PaginationItem',
  setup(_, { attrs, slots }) {
    return () => h('li', { ...attrs, 'data-slot': 'pagination-item' }, slots.default?.())
  },
})

export const PaginationLink = defineComponent({
  name: 'PaginationLink',
  inheritAttrs: false,
  props: {
    isActive: Boolean,
    size: { type: String as PropType<'default' | 'icon'>, default: 'icon' },
  },
  setup(props, { attrs, slots }) {
    return () => h('a', {
      ...attrs,
      'aria-current': props.isActive ? 'page' : undefined,
      'data-slot': 'pagination-link',
      'data-active': props.isActive ? 'true' : undefined,
      class: cn(paginationLinkClassName, props.size === 'default' ? paginationTextLinkClassName : '', attrs.class as string | undefined),
    }, slots.default?.())
  },
})

export const PaginationPrevious = defineComponent({
  name: 'PaginationPrevious',
  props: { text: { type: String, default: 'Previous' } },
  setup(props, { attrs }) {
    return () => h(PaginationLink, { ...attrs, 'aria-label': 'Go to previous page', size: 'default' }, () => [h(ChevronLeftIcon), h('span', { class: paginationTextClassName }, props.text)])
  },
})

export const PaginationNext = defineComponent({
  name: 'PaginationNext',
  props: { text: { type: String, default: 'Next' } },
  setup(props, { attrs }) {
    return () => h(PaginationLink, { ...attrs, 'aria-label': 'Go to next page', size: 'default' }, () => [h('span', { class: paginationTextClassName }, props.text), h(ChevronRightIcon)])
  },
})

export const PaginationEllipsis = defineComponent({
  name: 'PaginationEllipsis',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h('span', { ...attrs, 'aria-hidden': true, 'data-slot': 'pagination-ellipsis', class: cn(paginationEllipsisClassName, attrs.class as string | undefined) }, [h(EllipsisIcon), h('span', { class: paginationSrOnlyClassName }, 'More pages')])
  },
})
