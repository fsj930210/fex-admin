import i18next, {
  type i18n as I18nextInstance,
  type InitOptions,
  type Resource,
  type TOptions,
} from 'i18next'
import { createStore } from '../store/create-store'
import type {
  ChangeLanguageOptions,
  I18nBundle,
  I18nController,
  I18nControllerOptions,
  I18nEvent,
  I18nSnapshot,
} from './types'

function uniqueNamespaces(namespaces: readonly string[]) {
  return [...new Set(namespaces)].sort()
}

function toError(value: unknown) {
  return value instanceof Error ? value : new Error(String(value))
}

function createSnapshot(
  locale: string,
  revision: string | undefined,
  status: I18nSnapshot['status'],
): I18nSnapshot {
  return revision ? { locale, revision, status } : { locale, status }
}

export function createI18nController(options: I18nControllerOptions): I18nController {
  const instance: I18nextInstance = i18next.createInstance()
  const events = new Set<(event: I18nEvent) => void>()
  const loadedNamespaces = new Map<string, Set<string>>()
  const revisions = new Map<string, string>()
  let activeRequest = 0
  let activeAbort: AbortController | undefined

  for (const [locale, bundles] of Object.entries(options.resources ?? {})) {
    for (const namespace of Object.keys(bundles)) {
      const loaded = loadedNamespaces.get(locale) ?? new Set<string>()
      loaded.add(namespace)
      loadedNamespaces.set(locale, loaded)
    }
  }

  const initOptions: InitOptions = {
    lng: options.locale,
    fallbackLng: options.fallbackLocale,
    defaultNS: options.defaultNamespace ?? 'common',
    ns: options.defaultNamespace ?? 'common',
    ...(options.resources ? { resources: options.resources as Resource } : {}),
    initAsync: false,
    saveMissing: true,
    parseMissingKeyHandler: options.missingKeyDisplay ?? ((key) => `[[${key}]]`),
    missingKeyHandler: (languages, namespace, key) => {
      const locale = languages[0] ?? options.locale
      for (const listener of events)
        listener({ type: 'missingKey', locale, key: `${namespace}:${key}` })
    },
  }
  void instance.init(initOptions)

  const store = createStore<I18nSnapshot>({ locale: options.locale, status: 'ready' })

  function publish(next: I18nSnapshot) {
    const previous = store.getSnapshot()
    if (
      previous.locale === next.locale &&
      previous.revision === next.revision &&
      previous.status === next.status
    ) {
      return
    }
    store.setSnapshot(next)
  }

  function registerBundle(
    locale: string,
    namespace: string,
    bundle: I18nBundle,
    revision?: string,
  ) {
    instance.addResourceBundle(locale, namespace, bundle, true, true)
    const loaded = loadedNamespaces.get(locale) ?? new Set<string>()
    loaded.add(namespace)
    loadedNamespaces.set(locale, loaded)
    if (revision) revisions.set(locale, revision)
    publish(
      createSnapshot(store.getSnapshot().locale, revisions.get(locale), store.getSnapshot().status),
    )
  }

  async function prepare(locale: string, namespaces: readonly string[]) {
    const requested = uniqueNamespaces(namespaces)
    const loaded = loadedNamespaces.get(locale) ?? new Set<string>()
    const missing = requested.filter((namespace) => !loaded.has(namespace))
    if (missing.length === 0 || !options.loader) return

    const abort = new AbortController()
    const response = await options.loader({ locale, namespaces: missing, signal: abort.signal })
    if (response.locale !== locale) {
      throw new Error(`Expected i18n locale ${locale}, received ${response.locale}.`)
    }

    for (const namespace of missing) {
      const bundle = response.bundles[namespace]
      if (!bundle) throw new Error(`I18n response is missing namespace ${namespace}.`)
      registerBundle(locale, namespace, bundle, response.revision)
    }
  }

  async function changeLanguage(locale: string, changeOptions: ChangeLanguageOptions) {
    const previous = store.getSnapshot()
    const request = ++activeRequest
    activeAbort?.abort()
    activeAbort = new AbortController()
    publish({ ...previous, status: 'loading' })

    try {
      const requested = uniqueNamespaces(changeOptions.namespaces)
      const loaded = loadedNamespaces.get(locale) ?? new Set<string>()
      const missing = requested.filter((namespace) => !loaded.has(namespace))

      if (missing.length > 0 && options.loader) {
        const response = await options.loader({
          locale,
          namespaces: missing,
          signal: activeAbort.signal,
        })
        if (response.locale !== locale) {
          throw new Error(`Expected i18n locale ${locale}, received ${response.locale}.`)
        }
        for (const namespace of missing) {
          const bundle = response.bundles[namespace]
          if (!bundle) throw new Error(`I18n response is missing namespace ${namespace}.`)
          registerBundle(locale, namespace, bundle, response.revision)
        }
      }

      if (request !== activeRequest) return store.getSnapshot()
      await instance.changeLanguage(locale)
      const snapshot = createSnapshot(locale, revisions.get(locale), 'ready')
      publish(snapshot)
      for (const listener of events) {
        listener({
          type: 'localeChanged',
          locale,
          previousLocale: previous.locale,
          ...(snapshot.revision ? { revision: snapshot.revision } : {}),
        })
      }
      return snapshot
    } catch (reason) {
      if (request === activeRequest) {
        const error = toError(reason)
        publish({ ...previous, status: 'ready' })
        for (const listener of events) {
          listener({
            type: 'loadFailed',
            locale,
            namespaces: uniqueNamespaces(changeOptions.namespaces),
            error,
          })
        }
      }
      return store.getSnapshot()
    }
  }

  return {
    getSnapshot: store.getSnapshot,
    subscribe: store.subscribe,
    on(listener) {
      events.add(listener)
      return () => events.delete(listener)
    },
    t(key, values) {
      return values ? (instance.t(key, values as TOptions) as string) : (instance.t(key) as string)
    },
    registerBundle,
    prepare,
    changeLanguage,
  }
}
