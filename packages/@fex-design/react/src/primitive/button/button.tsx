import {
  buttonGroupClassName,
  buttonPrimitiveClassName,
  type ButtonGroupStyleProps,
} from '@fex-design/styles/button'
import { cn } from '@fex/utils'
import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, Ref } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  'data-slot'?: string | undefined
  ref?: Ref<HTMLButtonElement> | undefined
}

export interface ButtonGroupProps
  extends HTMLAttributes<HTMLDivElement>, ButtonGroupStyleProps {
  spacing?: number | string | undefined
  ref?: Ref<HTMLDivElement> | undefined
}

export function ButtonGroup({
  orientation = 'horizontal',
  spacing = 0,
  className,
  style,
  ref,
  ...props
}: ButtonGroupProps) {
  const groupStyle = {
    ...style,
    gap: typeof spacing === 'number' ? `${spacing}px` : spacing,
  } as CSSProperties
  return (
    <div
      {...props}
      ref={ref}
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupClassName({ orientation, connected: spacing === 0 }), className)}
      style={groupStyle}
    />
  )
}

export function Button({
  className,
  ref,
  type = 'button',
  'data-slot': dataSlot = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      className={cn(buttonPrimitiveClassName, className)}
      data-slot={dataSlot}
    />
  )
}
