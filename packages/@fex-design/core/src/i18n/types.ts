import type { ResourceLanguage } from 'i18next'

export type I18nBundle = ResourceLanguage

export interface I18nRemoteBundleResponse {
  locale: string
  revision: string
  bundles: Readonly<Record<string, I18nBundle>>
}

export interface I18nLoadRequest {
  locale: string
  namespaces: readonly string[]
  signal: AbortSignal
}

export type I18nLoader = (request: I18nLoadRequest) => Promise<I18nRemoteBundleResponse>

export interface I18nSnapshot {
  locale: string
  revision?: string
  status: 'ready' | 'loading'
}

export interface I18nMissingKeyEvent {
  type: 'missingKey'
  locale: string
  key: string
}

export interface I18nLocaleChangedEvent {
  type: 'localeChanged'
  locale: string
  previousLocale: string
  revision?: string
}

export interface I18nLoadFailedEvent {
  type: 'loadFailed'
  locale: string
  namespaces: readonly string[]
  error: Error
}

export type I18nEvent = I18nMissingKeyEvent | I18nLocaleChangedEvent | I18nLoadFailedEvent

export interface I18nControllerOptions {
  locale: string
  fallbackLocale: string | readonly string[]
  defaultNamespace?: string
  resources?: Readonly<Record<string, Readonly<Record<string, I18nBundle>>>>
  loader?: I18nLoader
  missingKeyDisplay?: (key: string) => string
}

export interface ChangeLanguageOptions {
  namespaces: readonly string[]
}

export interface I18nController {
  getSnapshot(): I18nSnapshot
  subscribe(listener: () => void): () => void
  on(listener: (event: I18nEvent) => void): () => void
  t(key: string, values?: Readonly<Record<string, unknown>>): string
  registerBundle(locale: string, namespace: string, bundle: I18nBundle, revision?: string): void
  prepare(locale: string, namespaces: readonly string[]): Promise<void>
  changeLanguage(locale: string, options: ChangeLanguageOptions): Promise<I18nSnapshot>
}
