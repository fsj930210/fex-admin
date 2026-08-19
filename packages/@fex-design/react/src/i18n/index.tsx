import { createContext, use, type PropsWithChildren } from 'react'
import type { I18nController } from '@fex-design/core/i18n/types'
import { useCoreStore } from '../hooks/use-core-store'

const I18nContext = createContext<I18nController | undefined>(undefined)

export interface I18nProviderProps extends PropsWithChildren {
  controller: I18nController
}

export function I18nProvider({ controller, children }: I18nProviderProps) {
  return <I18nContext value={controller}>{children}</I18nContext>
}

export function useI18n() {
  const controller = use(I18nContext)
  if (!controller) throw new Error('useI18n must be used within an I18nProvider.')
  const snapshot = useCoreStore(controller)
  return {
    ...snapshot,
    t: controller.t,
    changeLanguage: controller.changeLanguage,
    registerBundle: controller.registerBundle,
  }
}
