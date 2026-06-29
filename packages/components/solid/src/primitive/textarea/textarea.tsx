import { textareaClassName } from '@fex/components-styles/textarea'
import { cn } from '@fex/utils'
import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export function Textarea(props: JSX.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [local, rest] = splitProps(props, ['class'])
  return <textarea {...rest} data-slot="textarea" class={cn(textareaClassName, local.class)} />
}
