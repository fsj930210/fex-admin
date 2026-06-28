import type { JSX, ParentProps } from 'solid-js'
import { Show, splitProps } from 'solid-js'
import {
  Card as PrimitiveCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../primitive/card/card'

type SectionClass = {
  header?: string
  content?: string
  footer?: string
}

type SectionStyle = {
  header?: JSX.CSSProperties
  content?: JSX.CSSProperties
  footer?: JSX.CSSProperties
}

export interface CardProps extends ParentProps<Omit<JSX.HTMLAttributes<HTMLDivElement>, 'class' | 'style' | 'title'>> {
  title?: JSX.Element
  description?: JSX.Element
  footer?: JSX.Element
  class?: SectionClass
  style?: SectionStyle
}

export function Card(props: CardProps) {
  const [local, rest] = splitProps(props, ['title', 'description', 'footer', 'class', 'style', 'children'])

  return (
    <PrimitiveCard {...rest}>
      <Show when={local.title || local.description}>
        <CardHeader class={local.class?.header} style={local.style?.header}>
          <Show when={local.title}>
            <CardTitle>{local.title}</CardTitle>
          </Show>
          <Show when={local.description}>
            <CardDescription>{local.description}</CardDescription>
          </Show>
        </CardHeader>
      </Show>
      <CardContent class={local.class?.content} style={local.style?.content}>
        {local.children}
      </CardContent>
      <Show when={local.footer}>
        <CardFooter class={local.class?.footer} style={local.style?.footer}>
          {local.footer}
        </CardFooter>
      </Show>
    </PrimitiveCard>
  )
}

export default Card
