import { createContext, useContext, type Accessor, type ParentProps } from 'solid-js'
import type { I18nController, I18nSnapshot } from '@fex-design/core/i18n/types'
import { createCoreStoreSignal } from '../primitives/create-core-store-signal'

interface I18nContextValue {
  controller: I18nController
  snapshot: Accessor<I18nSnapshot>
}

const I18nContext = createContext<I18nContextValue>()

export interface I18nProviderProps extends ParentProps {
  controller: I18nController
}

export function I18nProvider(props: I18nProviderProps) {
  const snapshot = createCoreStoreSignal(props.controller)
  return (
    <I18nContext.Provider value={{ controller: props.controller, snapshot }}>
      {props.children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within an I18nProvider.')
  return {
    snapshot: context.snapshot,
    t(key: string, values?: Readonly<Record<string, unknown>>) {
      context.snapshot()
      return context.controller.t(key, values)
    },
    changeLanguage: context.controller.changeLanguage,
    registerBundle: context.controller.registerBundle,
  }
}
