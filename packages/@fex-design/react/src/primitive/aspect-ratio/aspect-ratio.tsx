import { aspectRatioClassName } from '@fex-design/styles/aspect-ratio'
import { cn } from '@fex/utils'
import type { ComponentProps, CSSProperties } from 'react'

export function AspectRatio({
  ratio,
  className,
  style,
  ...props
}: ComponentProps<'div'> & { ratio: number }) {
  return (
    <div
      data-slot="aspect-ratio"
      className={cn(aspectRatioClassName, className)}
      style={{ aspectRatio: ratio, ...style } as CSSProperties}
      {...props}
    />
  )
}
