import { badgeClassName, type BadgeStyleProps } from '@fex/components-styles/badge'
import { cn } from '@fex/utils'
import type { JSX, ParentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export function Badge(props: ParentProps<JSX.HTMLAttributes<HTMLSpanElement>> & BadgeStyleProps) {
  const [local, rest] = splitProps(props, ['class', 'children', 'variant'])
  return <span {...rest} data-slot="badge" data-variant={local.variant ?? 'default'} class={cn(badgeClassName({ variant: local.variant }), local.class)}>{local.children}</span>
}
