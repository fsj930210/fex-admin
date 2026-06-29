import { textareaClassName } from '@fex/components-styles/textarea'
import { cn } from '@fex/utils'
import type { ComponentProps } from 'react'

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea data-slot="textarea" className={cn(textareaClassName, className)} {...props} />
}
