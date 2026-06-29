import { buttonPrimitiveClassName } from '@fex/components-styles/button'
import { cn } from '@fex/utils'
import type { ButtonHTMLAttributes, Ref } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>
}

export function Button({ className, ref, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      className={cn(buttonPrimitiveClassName, className)}
      data-slot="button"
    />
  )
}
