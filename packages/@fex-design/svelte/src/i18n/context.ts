import { getContext, setContext } from 'svelte'
import type { I18nController, I18nSnapshot } from '@fex-design/core/i18n/types'
import type { Readable } from 'svelte/store'

export interface I18nContext {
  controller: I18nController
  snapshot: Readable<I18nSnapshot>
}

export const I18N_CONTEXT = Symbol('I18nContext')

export function setI18nContext(context: I18nContext) {
  setContext(I18N_CONTEXT, context)
}

export function useI18n() {
  const context = getContext<I18nContext>(I18N_CONTEXT)
  if (!context) throw new Error('useI18n must be used within an I18nProvider.')
  return context
}
