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
  root?: string
  header?: string
  title?: string
  description?: string
  content?: string
  footer?: string
}

type CardStyle = {
  root?: React.CSSProperties
  header?: React.CSSProperties
  title?: React.CSSProperties
  description?: React.CSSProperties
  content?: React.CSSProperties
  footer?: React.CSSProperties
}

type CardSize = 'sm' | 'md' | 'lg'

export interface CardProps extends Omit<ComponentProps<'div'>, 'className' | 'style' | 'title'> {
  title?: ReactNode
  description?: ReactNode
  footer?: ReactNode
  size?: CardSize
  className?: CardClassName
  style?: CardStyle
}

export function Card({
  title,
  description,
  footer,
  size,
  className,
  style,
  children,
  ...props
}: CardProps) {
  return (
    <PrimitiveCard
      {...props}
      data-size={size ?? 'md'}
      className={className?.root}
      style={style?.root}
    >
      {title || description ? (
        <CardHeader className={className?.header} style={style?.header}>
          {title ? (
            <CardTitle className={className?.title} style={style?.title}>
              {title}
            </CardTitle>
          ) : null}
          {description ? (
            <CardDescription className={className?.description} style={style?.description}>
              {description}
            </CardDescription>
          ) : null}
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
