import { mentionsContentClassName } from '@fex-design/styles/mentions'
import { cn } from '@fex/utils'
import type { ComponentProps } from 'react'
import { useMentions } from './use-mentions'

export function MentionsContent({ className, ...props }: ComponentProps<'div'>) {
  const mentions = useMentions()
  if (!mentions.open || !mentions.query) return null
  return (
    <div
      {...props}
      data-slot="mentions-content"
      className={cn(mentionsContentClassName, 'absolute left-0 top-full mt-1 min-w-64', className)}
    />
  )
}
