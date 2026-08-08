import type { ReactNode } from 'react'
import { useMentions } from './use-mentions'

export interface MentionsPrefixCaseProps {
  prefix: string
  children?: ReactNode
}

export function MentionsPrefixCase({ prefix, children }: MentionsPrefixCaseProps) {
  const mentions = useMentions()
  return mentions.prefix === prefix ? children : null
}
