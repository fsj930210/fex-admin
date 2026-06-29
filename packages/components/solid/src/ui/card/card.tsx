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
  root?: string
  header?: string
  title?: string
  description?: string
  content?: string
  footer?: string
}

type SectionStyle = {
  root?: JSX.CSSProperties
  header?: JSX.CSSProperties
  title?: JSX.CSSProperties
  description?: JSX.CSSProperties
  content?: JSX.CSSProperties
  footer?: JSX.CSSProperties
}

type CardSize = 'sm' | 'md' | 'lg'

export interface CardProps extends ParentProps<Omit<JSX.HTMLAttributes<HTMLDivElement>, 'class' | 'style' | 'title'>> {
  title?: JSX.Element
  description?: JSX.Element
  footer?: JSX.Element
  size?: CardSize
  class?: SectionClass
  style?: SectionStyle
}

export function Card(props: CardProps) {
  const [local, rest] = splitProps(props, ['title', 'description', 'footer', 'size', 'class', 'style', 'children'])

  return (
    <PrimitiveCard
      {...rest}
      data-size={local.size ?? 'md'}
      class={local.class?.root}
      style={local.style?.root}
    >
      <Show when={local.title || local.description}>
        <CardHeader class={local.class?.header} style={local.style?.header}>
          <Show when={local.title}>
            <CardTitle class={local.class?.title} style={local.style?.title}>
              {local.title}
            </CardTitle>
          </Show>
          <Show when={local.description}>
            <CardDescription class={local.class?.description} style={local.style?.description}>
              {local.description}
            </CardDescription>
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
