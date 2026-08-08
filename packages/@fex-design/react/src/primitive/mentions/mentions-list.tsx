import { mentionsListClassName } from '@fex-design/styles/mentions'
import { cn } from '@fex/utils'
import type { ComponentProps } from 'react'
import { ListboxRoot } from '../listbox/listbox'
import { useMentionsContext } from './mentions-context'

export function MentionsList({ className, ...props }: ComponentProps<'div'>) {
  const context = useMentionsContext('MentionsList')
  return (
    <ListboxRoot
      {...props}
      id={context.listId}
      value={context.snapshot.activeKey}
      onChange={(value) => context.controller.setActiveKey(Array.isArray(value) ? value[0] : value)}
      className={cn(mentionsListClassName, className)}
    />
  )
}
