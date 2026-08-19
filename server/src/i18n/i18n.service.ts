import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common'
import { i18nBundles, type SupportedI18nLocale } from './i18n.data.js'

@Injectable()
export class I18nService {
  async getBundles(locale: string, namespaces: readonly string[], delay?: number, fail?: boolean) {
    if (!(locale in i18nBundles)) throw new NotFoundException(`Unsupported locale ${locale}.`)
    if (delay) await new Promise<void>((resolve) => setTimeout(resolve, delay))
    if (fail) throw new ServiceUnavailableException('I18n resource service is unavailable.')

    const localeBundles = i18nBundles[locale as SupportedI18nLocale]
    const bundles: Record<string, object> = {}
    for (const namespace of namespaces) {
      const bundle = localeBundles[namespace as keyof typeof localeBundles]
      if (!bundle)
        throw new NotFoundException(`Locale ${locale} does not provide namespace ${namespace}.`)
      bundles[namespace] = bundle
    }

    return { locale, revision: 'demo-r2', bundles }
  }
}
