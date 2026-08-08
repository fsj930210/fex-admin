import type { MentionsKey, MentionsRegisteredItem } from '@fex-design/core/mentions/types'
import { mentionsItemClassName } from '@fex-design/styles/mentions'
import { cn } from '@fex/utils'
import { type ComponentProps, type ReactNode } from 'react'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { ListboxItem } from '../listbox/listbox'
import { useMentionsContext } from './mentions-context'
import { useMentionsItem } from './use-mentions'

export interface MentionsItemProps<TData = unknown>
  extends Omit<ComponentProps<'div'>, 'children' | 'value'> {
  itemKey?: MentionsKey | undefined
  value: string
  disabled?: boolean | undefined
  data?: TData | undefined
  children?:
    | ReactNode
    | ((state: { active: boolean; disabled: boolean; item: MentionsRegisteredItem<TData> }) => ReactNode)
}

export function MentionsItem<TData = unknown>({
  itemKey,
  value,
  disabled = false,
  data,
  children,
  className,
  onPointerMove,
  onPointerDown,
  onClick,
  ...props
}: MentionsItemProps<TData>) {
  const key = itemKey ?? value
  const context = useMentionsContext('MentionsItem')
  const state = useMentionsItem(key, disabled)
  const item: MentionsRegisteredItem<TData> = { key, value, disabled, data }

  useIsomorphicLayoutEffect(() => context.controller.registerItem(item), [
    context.controller,
    key,
    value,
    disabled,
    data,
  ])

  return (
    <ListboxItem
      {...props}
      id={context.listId + '-' + key}
      value={key}
      disabled={state.disabled}
      className={cn(mentionsItemClassName, className)}
      onPointerMove={(event) => {
        onPointerMove?.(event)
        if (!event.defaultPrevented) state.activate()
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        if (!event.defaultPrevented) event.preventDefault()
      }}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) state.select()
      }}
    >
      {typeof children === 'function' ? children({ active: state.active, disabled, item }) : children}
    </ListboxItem>
  )
}
