import type { MentionsController, MentionsSnapshot } from '@fex-design/core/mentions/types'
import { inject, type ComputedRef, type InjectionKey, type ShallowRef } from 'vue'

export interface MentionsContext {
  controller: MentionsController
  snapshot: ShallowRef<MentionsSnapshot>
  listId: string
  disabled: ComputedRef<boolean>
  readOnly: ComputedRef<boolean>
  invalid: ComputedRef<boolean>
  required: ComputedRef<boolean>
}

export const mentionsKey: InjectionKey<MentionsContext> = Symbol('Mentions')

export function useMentions(component: string) {
  const context = inject(mentionsKey)
  if (!context) throw new Error(component + ' must be used inside MentionsRoot.')
  return context
}
