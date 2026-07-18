import { buttonPrimitiveClassName } from '@fex/components-styles/button'
import { cn } from '@fex/utils'
import type { JSX, ParentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export interface ButtonProps extends ParentProps<JSX.ButtonHTMLAttributes<HTMLButtonElement>> {}

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ['class', 'children', 'type'])

  return (
    <button data-slot="button" {...rest} type={local.type ?? 'button'} class={cn(buttonPrimitiveClassName, local.class)}>
      {local.children}
    </button>
  )
}

export default Button
