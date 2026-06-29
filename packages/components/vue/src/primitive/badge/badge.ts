import { badgeClassName, type BadgeStyleProps } from '@fex/components-styles/badge'
import { cn } from '@fex/utils'
import { defineComponent, h, type PropType } from 'vue'

export const Badge = defineComponent({
  name: 'Badge',
  inheritAttrs: false,
  props: { variant: String as PropType<BadgeStyleProps['variant']> },
  setup(props, { attrs, slots }) {
    const variant = props.variant ?? 'default'
    return () => h('span', { ...attrs, 'data-slot': 'badge', 'data-variant': variant, class: cn(badgeClassName({ variant }), attrs.class as string | undefined) }, slots.default?.())
  },
})
