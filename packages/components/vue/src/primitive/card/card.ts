import {
  cardClassName,
  cardContentClassName,
  cardDescriptionClassName,
  cardFooterClassName,
  cardHeaderClassName,
  cardTitleClassName,
} from '@fex/components-styles/card'
import { cn } from '@fex/utils'
import { defineComponent, h } from 'vue'

function createCardPart(name: string, slot: string, className: string) {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () =>
        h(
          'div',
          {
            ...attrs,
            'data-slot': slot,
            class: cn(className, attrs.class as string | undefined),
          },
          slots.default?.(),
        )
    },
  })
}

export const Card = createCardPart('Card', 'card', cardClassName)
export const CardHeader = createCardPart('CardHeader', 'card-header', cardHeaderClassName)
export const CardTitle = createCardPart('CardTitle', 'card-title', cardTitleClassName)
export const CardDescription = createCardPart(
  'CardDescription',
  'card-description',
  cardDescriptionClassName,
)
export const CardContent = createCardPart('CardContent', 'card-content', cardContentClassName)
export const CardFooter = createCardPart('CardFooter', 'card-footer', cardFooterClassName)
