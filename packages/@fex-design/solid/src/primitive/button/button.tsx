import { buttonGroupClassName, buttonPrimitiveClassName, type ButtonGroupStyleProps } from '@fex-design/styles/button'
import { cn } from '@fex/utils'
import type { JSX, ParentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export interface ButtonProps extends ParentProps<JSX.ButtonHTMLAttributes<HTMLButtonElement>> {}

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ['class', 'children', 'type'])

  return (
    <button
      data-slot="button"
      {...rest}
      type={local.type ?? 'button'}
      class={cn(buttonPrimitiveClassName, local.class)}
    >
      {local.children}
    </button>
  )
}

export interface ButtonGroupProps extends ParentProps<JSX.HTMLAttributes<HTMLDivElement>>, ButtonGroupStyleProps {
  spacing?: number | string
}
export function ButtonGroup(props: ButtonGroupProps) {
  const [local, rest] = splitProps(props, ['class', 'children', 'orientation', 'spacing', 'style'])
  const connected = () => (local.spacing ?? 0) === 0
  return <div {...rest} role="group" data-slot="button-group" data-orientation={local.orientation ?? 'horizontal'} class={cn(buttonGroupClassName({ orientation: local.orientation, connected: connected() }), local.class)} style={{ ...(local.style as JSX.CSSProperties), gap: typeof local.spacing === 'number' ? `${local.spacing}px` : local.spacing }}>
    {local.children}
  </div>
}

export default Button
