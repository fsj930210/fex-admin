import { createContext, use } from 'react'
import type { MentionsController, MentionsSnapshot } from '@fex-design/core/mentions/types'

export interface MentionsContextValue {
  controller: MentionsController
  snapshot: MentionsSnapshot
  listId: string
  disabled: boolean
  readOnly: boolean
  invalid: boolean
  required: boolean
  status?: 'error' | 'warning' | undefined
  setTriggerElement: (element: HTMLTextAreaElement | HTMLInputElement | null) => void
}

export const MentionsContext = createContext<MentionsContextValue | null>(null)

export function useMentionsContext(component: string) {
  const context = use(MentionsContext)
  if (!context) throw new Error(component + ' must be used inside MentionsRoot.')
  return context
}
