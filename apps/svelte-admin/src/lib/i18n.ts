import { createI18nController } from '@fex-design/core/i18n/create-i18n-controller'
import type { I18nBundle, I18nRemoteBundleResponse } from '@fex-design/core/i18n/types'

type DemoMode = 'normal' | 'delayed' | 'failure'
let demoMode: DemoMode = 'normal'
export function setI18nDemoMode(mode: DemoMode) {
  demoMode = mode
}

export const i18n = createI18nController({
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  loader: async ({ locale, namespaces, signal }) => {
    const query = new URLSearchParams({ namespaces: namespaces.join(',') })
    if (demoMode === 'delayed') query.set('delay', '1500')
    if (demoMode === 'failure') query.set('fail', 'true')
    const response = await fetch(`/i18n-api/bundles/${locale}?${query}`, { signal })
    const body = (await response.json()) as { message: string; data?: I18nRemoteBundleResponse }
    if (!response.ok || !body.data) throw new Error(body.message)
    return body.data
  },
})

export const i18nReady = fetch('/locales/zh-CN.json')
  .then(async (response) => {
    if (!response.ok) throw new Error(`Failed to load default locale: ${response.status}`)
    return (await response.json()) as Record<string, I18nBundle>
  })
  .then((bundles) => {
    for (const [namespace, bundle] of Object.entries(bundles))
      i18n.registerBundle('zh-CN', namespace, bundle)
  })
