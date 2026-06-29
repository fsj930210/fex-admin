import { inputClassName } from '@fex/components-styles/input'
import { cn } from '@fex/utils'
import type { ComponentProps } from 'react'

export function Input({ className, type, ...props }: ComponentProps<'input'>) {
  return (
    <input type={type} data-slot="input" className={cn(inputClassName, className)} {...props} />
  )
}
