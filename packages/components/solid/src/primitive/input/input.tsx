import { inputClassName } from '@fex/components-styles/input'
import { cn } from '@fex/utils'
import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export function Input(props: JSX.InputHTMLAttributes<HTMLInputElement>) {
  const [local, rest] = splitProps(props, ['class'])
  return <input {...rest} data-slot="input" class={cn(inputClassName, local.class)} />
}
