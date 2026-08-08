import type { MentionsController, MentionsSnapshot } from '@fex-design/core/mentions/types'
import { getContext, setContext } from 'svelte'

const mentionsContextKey = Symbol('Mentions')

export interface MentionsContext {
  controller: MentionsController
  snapshot: () => MentionsSnapshot
  listId: string
  disabled: () => boolean
  readOnly: () => boolean
  invalid: () => boolean
  required: () => boolean
}

export function setMentionsContext(context: MentionsContext) {
  setContext(mentionsContextKey, context)
}

export function useMentions(component: string) {
  const context = getContext<MentionsContext | undefined>(mentionsContextKey)
  if (!context) throw new Error(component + ' must be used inside MentionsRoot.')
  return context
}
