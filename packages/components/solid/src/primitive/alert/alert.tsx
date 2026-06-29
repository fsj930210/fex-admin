import { alertActionClassName, alertClassName, alertDescriptionClassName, alertTitleClassName, type AlertStyleProps } from '@fex/components-styles/alert'
import { cn } from '@fex/utils'
import type { JSX, ParentProps } from 'solid-js'
import { splitProps } from 'solid-js'

type DivProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>

export function Alert(props: DivProps & AlertStyleProps) {
  const [local, rest] = splitProps(props, ['class', 'children', 'variant'])
  return <div {...rest} data-slot="alert" role="alert" class={cn(alertClassName({ variant: local.variant }), local.class)}>{local.children}</div>
}

export function AlertTitle(props: DivProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return <div {...rest} data-slot="alert-title" class={cn(alertTitleClassName, local.class)}>{local.children}</div>
}

export function AlertDescription(props: DivProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return <div {...rest} data-slot="alert-description" class={cn(alertDescriptionClassName, local.class)}>{local.children}</div>
}

export function AlertAction(props: DivProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return <div {...rest} data-slot="alert-action" class={cn(alertActionClassName, local.class)}>{local.children}</div>
}
