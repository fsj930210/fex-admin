import { inject, Injectable, InjectionToken, type Provider } from '@angular/core'
import type { ChangeLanguageOptions, I18nBundle, I18nController } from '@fex-design/core/i18n/types'
import { createCoreStoreSignal } from '../signals/core-store-signal'

export const FEX_I18N_CONTROLLER = new InjectionToken<I18nController>('FEX_I18N_CONTROLLER')

@Injectable()
export class I18nService {
  private readonly controller = inject(FEX_I18N_CONTROLLER)
  readonly snapshot = createCoreStoreSignal(this.controller)

  t(key: string, values?: Readonly<Record<string, unknown>>) {
    this.snapshot()
    return this.controller.t(key, values)
  }

  changeLanguage(locale: string, options: ChangeLanguageOptions) {
    return this.controller.changeLanguage(locale, options)
  }

  registerBundle(
    locale: string,
    namespace: string,
    bundle: I18nBundle,
    revision?: string,
  ) {
    this.controller.registerBundle(locale, namespace, bundle, revision)
  }
}

export function provideI18n(controller: I18nController): Provider[] {
  return [{ provide: FEX_I18N_CONTROLLER, useValue: controller }, I18nService]
}
