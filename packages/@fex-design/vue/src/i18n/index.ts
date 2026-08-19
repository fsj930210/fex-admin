import { inject, shallowRef, type App, type InjectionKey } from 'vue'
import type { I18nController } from '@fex-design/core/i18n/types'

interface I18nContext {
  controller: I18nController
  snapshot: ReturnType<typeof shallowRef>
}

const i18nContextKey: InjectionKey<I18nContext> = Symbol('I18nContext')

export function createI18nPlugin(controller: I18nController) {
  return {
    install(app: App) {
      const snapshot = shallowRef(controller.getSnapshot())
      controller.subscribe(() => {
        snapshot.value = controller.getSnapshot()
      })
      app.provide(i18nContextKey, { controller, snapshot })
    },
  }
}

export function useI18n() {
  const context = inject(i18nContextKey)
  if (!context) throw new Error('useI18n must be used after createI18nPlugin().')
  return {
    snapshot: context.snapshot,
    t(key: string, values?: Readonly<Record<string, unknown>>) {
      void context.snapshot.value
      return context.controller.t(key, values)
    },
    changeLanguage: context.controller.changeLanguage,
    registerBundle: context.controller.registerBundle,
  }
}
