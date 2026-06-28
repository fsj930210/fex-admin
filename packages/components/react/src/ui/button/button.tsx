import {
  buttonClassName,
  buttonIconClassName,
  buttonSpinnerClassName,
  type ButtonStyleProps,
} from '@fex/components-styles/button'
import { cn } from '@fex/utils'
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { Button as PrimitiveButton } from '../../primitive/button/button'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleProps {
  ref?: Ref<HTMLButtonElement>
  icon?: ReactNode
  iconPlacement?: 'start' | 'end'
  loading?: boolean
}

const LoadingIcon = () => (
  <svg
    className={buttonSpinnerClassName}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)

export function Button({
  className,
  variant = 'default',
  size = 'default',
  effect,
  icon,
  iconPlacement = 'start',
  loading = false,
  disabled,
  children,
  ref,
  type = 'button',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading
  const iconNode = loading ? <LoadingIcon /> : icon

  return (
    <PrimitiveButton
      {...props}
      {...(ref ? { ref } : {})}
      type={type}
      className={cn(buttonClassName({ variant, size, effect }), className)}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-effect={effect}
      data-loading={loading ? 'true' : undefined}
      disabled={isDisabled}
    >
      {iconPlacement === 'start' && iconNode ? (
        <span className={buttonIconClassName({ placement: 'start', effect })} data-icon="inline-start">
          {iconNode}
        </span>
      ) : null}
      {children}
      {iconPlacement === 'end' && iconNode ? (
        <span className={buttonIconClassName({ placement: 'end', effect })} data-icon="inline-end">
          {iconNode}
        </span>
      ) : null}
    </PrimitiveButton>
  )
}

export default Button
