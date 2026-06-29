import { kbdClassName, kbdGroupClassName } from '@fex/components-styles/kbd'
import { cn } from '@fex/utils'
import type { JSX, ParentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export function Kbd(props: ParentProps<JSX.HTMLAttributes<HTMLElement>>) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return <kbd {...rest} data-slot="kbd" class={cn(kbdClassName, local.class)}>{local.children}</kbd>
}

export function KbdGroup(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return <div {...rest} data-slot="kbd-group" class={cn(kbdGroupClassName, local.class)}>{local.children}</div>
}
