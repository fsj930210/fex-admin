import { spinnerClassName, type SpinnerStyleProps } from '@fex/components-styles/spinner'
import { cn } from '@fex/utils'
import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { LoadingIcon } from '../../icon/loading'

export function Spinner(props: JSX.HTMLAttributes<HTMLSpanElement> & SpinnerStyleProps) {
  const [local, rest] = splitProps(props, ['class', 'size'])
  return <span {...rest} data-slot="spinner" class={cn(spinnerClassName({ size: local.size }), local.class)}><LoadingIcon /></span>
}
