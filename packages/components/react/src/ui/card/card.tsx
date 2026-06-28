import { type ComponentProps, type ReactNode } from 'react'
import {
  Card as PrimitiveCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../primitive/card/card'

type CardClassName = {
  header?: string
  content?: string
  footer?: string
}

type CardStyle = {
  header?: React.CSSProperties
  content?: React.CSSProperties
  footer?: React.CSSProperties
}

export interface CardProps extends Omit<ComponentProps<'div'>, 'className' | 'style' | 'title'> {
  title?: ReactNode
  description?: ReactNode
  footer?: ReactNode
  className?: CardClassName
  style?: CardStyle
}

export function Card({
  title,
  description,
  footer,
  className,
  style,
  children,
  ...props
}: CardProps) {
  return (
    <PrimitiveCard {...props}>
      {title || description ? (
        <CardHeader className={className?.header} style={style?.header}>
          {title ? <CardTitle>{title}</CardTitle> : null}
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
      ) : null}
      <CardContent className={className?.content} style={style?.content}>
        {children}
      </CardContent>
      {footer ? (
        <CardFooter className={className?.footer} style={style?.footer}>
          {footer}
        </CardFooter>
      ) : null}
    </PrimitiveCard>
  )
}

export default Card
