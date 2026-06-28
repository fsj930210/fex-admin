import {
  cardClassName,
  cardContentClassName,
  cardDescriptionClassName,
  cardFooterClassName,
  cardHeaderClassName,
  cardTitleClassName,
} from '@fex/components-styles/card'
import { cn } from '@fex/utils'
import type { JSX, ParentProps } from 'solid-js'
import { splitProps } from 'solid-js'

type CardPartProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>

function createCardPart(slot: string, className: () => string) {
  return function CardPart(props: CardPartProps) {
    const [local, rest] = splitProps(props, ['class', 'children'])

    return (
      <div {...rest} data-slot={slot} class={cn(className(), local.class)}>
        {local.children}
      </div>
    )
  }
}

export const Card = createCardPart('card', cardClassName)
export const CardHeader = createCardPart('card-header', cardHeaderClassName)
export const CardTitle = createCardPart('card-title', cardTitleClassName)
export const CardDescription = createCardPart('card-description', cardDescriptionClassName)
export const CardContent = createCardPart('card-content', cardContentClassName)
export const CardFooter = createCardPart('card-footer', cardFooterClassName)
