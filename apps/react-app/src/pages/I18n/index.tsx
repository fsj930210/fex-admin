import { Card } from '@fex-design/react/ui/card'
import { useI18n } from '@fex-design/react/i18n'
import { useState } from 'react'
import { Link } from 'react-router'
import { setI18nDemoMode } from '../../i18n'

const namespaces = ['common', 'admin', 'order']

export function I18nPage() {
  const { changeLanguage, locale, revision, status, t, registerBundle } = useI18n()
  const [error, setError] = useState('')
  const [runtimeReady, setRuntimeReady] = useState(false)

  async function change(locale: string, mode: 'normal' | 'delayed' | 'failure') {
    setError('')
    setI18nDemoMode(mode)
    const result = await changeLanguage(locale, { namespaces })
    setI18nDemoMode('normal')
    if (result.locale !== locale)
      setError('Remote resource failed. The current locale was preserved.')
  }

  function addRuntimeBundle() {
    registerBundle(
      locale,
      'runtime',
      {
        editor: {
          saved: locale === 'zh-CN' ? '运行时文本已保存' : 'Runtime text saved',
        },
      },
      'local-edit-1',
    )
    setRuntimeReady(true)
  }

  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-space-xl space-y-space-md">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
            Back home
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">I18n</h1>
        </header>
        <div className="grid gap-space-xl">
          <Card
            title="Core translation API"
            description="Use t with interpolation, plural values, and namespaces."
          >
            <div className="flex flex-wrap items-center gap-space-md">
              <span>{t('demo.greeting', { name: 'Fex' })}</span>
              <span>{t('order:count', { count: 1 })}</span>
              <span>{t('order:count', { count: 5 })}</span>
              <span>{t('admin:status.ready')}</span>
            </div>
          </Card>
          <Card
            title="Local bundle and namespaces"
            description="The initial Chinese resources are available before any network request."
          >
            <div className="grid gap-space-sm text-sm text-muted-foreground sm:grid-cols-2">
              <span>common: {t('demo.title')}</span>
              <span>admin: {t('admin:filter.placeholder')}</span>
              <span>order: {t('order:title')}</span>
              <span>locale: {locale}</span>
            </div>
          </Card>
          <Card
            title="Language switching"
            description="Switching waits for the requested namespaces before changing the active locale."
          >
            <div className="flex flex-wrap items-center gap-space-md">
              <button
                className="rounded-md border border-border px-space-md py-space-sm"
                onClick={() => change('zh-CN', 'normal')}
                type="button"
              >
                中文
              </button>
              <button
                className="rounded-md border border-border px-space-md py-space-sm"
                onClick={() => change('en-US', 'normal')}
                type="button"
              >
                English
              </button>
              <button
                className="rounded-md border border-border px-space-md py-space-sm"
                onClick={() => change('fr-FR', 'normal')}
                type="button"
              >
                Francais
              </button>
              <span className="text-sm text-muted-foreground">
                {locale} {revision ?? 'local'}
              </span>
            </div>
          </Card>
          <Card
            title="Remote bundle"
            description="The current text stays visible until the delayed resource is ready."
          >
            <div className="flex flex-wrap items-center gap-space-md">
              <button
                className="rounded-md border border-border px-space-md py-space-sm"
                disabled={status === 'loading'}
                onClick={() => change('en-US', 'delayed')}
                type="button"
              >
                {status === 'loading' ? 'Loading...' : 'Load English remotely'}
              </button>
              <span>{t('order:title')}</span>
              <span className="text-sm text-muted-foreground">status: {status}</span>
            </div>
          </Card>
          <Card
            title="Fallback and failure"
            description="Missing English keys fall back to Chinese; failed loads keep the active locale."
          >
            <div className="flex flex-wrap items-center gap-space-md">
              <span>{t('order:owner')}</span>
              <button
                className="rounded-md border border-border px-space-md py-space-sm"
                onClick={() => change('fr-FR', 'failure')}
                type="button"
              >
                Simulate remote failure
              </button>
              {error ? <span className="text-sm text-error">{error}</span> : null}
              <span>{t('missing:unknown')}</span>
            </div>
          </Card>
          <Card
            title="Runtime resource editing"
            description="The host can add a newly published namespace without rebuilding the application."
          >
            <div className="flex flex-wrap items-center gap-space-md">
              <button
                className="rounded-md border border-border px-space-md py-space-sm"
                disabled={runtimeReady}
                onClick={addRuntimeBundle}
                type="button"
              >
                {runtimeReady ? 'Runtime bundle registered' : 'Register edited text'}
              </button>
              <span>{t('runtime:editor.saved')}</span>
              <span className="text-sm text-muted-foreground">revision: {revision ?? 'local'}</span>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
