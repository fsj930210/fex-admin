import { emptyClassName, emptyContentClassName, emptyDescriptionClassName, emptyHeaderClassName, emptyMediaClassName, emptyTitleClassName, type EmptyMediaStyleProps } from '@fex/components-styles/empty'
import { cn } from '@fex/utils'
import { defineComponent, h, type PropType } from 'vue'

function createPart(name: string, tag: string, slot: string, className: string) {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => h(tag, { ...attrs, 'data-slot': slot, class: cn(className, attrs.class as string | undefined) }, slots.default?.())
    },
  })
}

export const Empty = createPart('Empty', 'div', 'empty', emptyClassName)
export const EmptyHeader = createPart('EmptyHeader', 'div', 'empty-header', emptyHeaderClassName)
export const EmptyTitle = createPart('EmptyTitle', 'div', 'empty-title', emptyTitleClassName)
export const EmptyDescription = createPart('EmptyDescription', 'p', 'empty-description', emptyDescriptionClassName)
export const EmptyContent = createPart('EmptyContent', 'div', 'empty-content', emptyContentClassName)

export const EmptyMedia = defineComponent({
  name: 'EmptyMedia',
  inheritAttrs: false,
  props: { variant: String as PropType<EmptyMediaStyleProps['variant']> },
  setup(props, { attrs, slots }) {
    const variant = props.variant ?? 'default'
    return () => h('div', { ...attrs, 'data-slot': 'empty-icon', 'data-variant': variant, class: cn(emptyMediaClassName({ variant }), attrs.class as string | undefined) }, slots.default?.())
  },
})
