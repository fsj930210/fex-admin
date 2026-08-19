<script lang="ts">
  import Card from '@fex-design/svelte/ui/card'
  import { useI18n } from '@fex-design/svelte/i18n'
  import { setI18nDemoMode } from '../../lib/i18n'

  const namespaces = ['common', 'admin', 'order']
  const { controller, snapshot } = useI18n()
  let error = $state('')
  let runtimeReady = $state(false)

  function t(key: string, values?: Record<string, unknown>) {
    void $snapshot
    return controller.t(key, values)
  }

  async function change(locale: string, mode: 'normal' | 'delayed' | 'failure') {
    error = ''
    setI18nDemoMode(mode)
    const result = await controller.changeLanguage(locale, { namespaces })
    setI18nDemoMode('normal')
    if (result.locale !== locale) error = 'Remote resource failed. The current locale was preserved.'
  }

  function addRuntimeBundle() {
    controller.registerBundle($snapshot.locale, 'runtime', {
      editor: { saved: $snapshot.locale === 'zh-CN' ? '运行时文本已保存' : 'Runtime text saved' },
    }, 'local-edit-1')
    runtimeReady = true
  }
</script>

<svelte:head><title>I18n</title></svelte:head>

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-5xl">
    <header class="mb-space-xl space-y-space-md">
      <a class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</a>
      <h1 class="text-2xl font-semibold text-foreground">I18n</h1>
    </header>

    <div class="grid gap-space-xl">
      <Card title="Core translation API" description="Use t with interpolation, plural values, and namespaces.">
        <div class="flex flex-wrap items-center gap-space-md">
          <span>{t('demo.greeting', { name: 'Fex' })}</span>
          <span>{t('order:count', { count: 1 })}</span>
          <span>{t('order:count', { count: 5 })}</span>
          <span>{t('admin:status.ready')}</span>
        </div>
      </Card>

      <Card title="Local bundle and namespaces" description="The initial Chinese resources are available before any network request.">
        <div class="grid gap-space-sm text-sm text-muted-foreground sm:grid-cols-2">
          <span>common: {t('demo.title')}</span>
          <span>admin: {t('admin:filter.placeholder')}</span>
          <span>order: {t('order:title')}</span>
          <span>locale: {$snapshot.locale}</span>
        </div>
      </Card>

      <Card title="Language switching" description="Switching waits for the requested namespaces before changing the active locale.">
        <div class="flex flex-wrap items-center gap-space-md">
          <button class="rounded-md border border-border px-space-md py-space-sm" type="button" onclick={() => change('zh-CN', 'normal')}>中文</button>
          <button class="rounded-md border border-border px-space-md py-space-sm" type="button" onclick={() => change('en-US', 'normal')}>English</button>
          <button class="rounded-md border border-border px-space-md py-space-sm" type="button" onclick={() => change('fr-FR', 'normal')}>Francais</button>
          <span class="text-sm text-muted-foreground">{$snapshot.locale} {$snapshot.revision ?? 'local'}</span>
        </div>
      </Card>

      <Card title="Remote bundle" description="The current text stays visible until the delayed resource is ready.">
        <div class="flex flex-wrap items-center gap-space-md">
          <button class="rounded-md border border-border px-space-md py-space-sm" disabled={$snapshot.status === 'loading'} type="button" onclick={() => change('en-US', 'delayed')}>
            {$snapshot.status === 'loading' ? 'Loading...' : 'Load English remotely'}
          </button>
          <span>{t('order:title')}</span>
          <span class="text-sm text-muted-foreground">status: {$snapshot.status}</span>
        </div>
      </Card>

      <Card title="Fallback, missing key, and failure" description="Missing English keys fall back to Chinese; unknown keys are visible; failed loads preserve the active locale.">
        <div class="flex flex-wrap items-center gap-space-md">
          <span>{t('order:owner')}</span>
          <span>{t('missing:unknown')}</span>
          <button class="rounded-md border border-border px-space-md py-space-sm" type="button" onclick={() => change('fr-FR', 'failure')}>Simulate remote failure</button>
          <span class="text-sm text-error">{error}</span>
        </div>
      </Card>

      <Card title="Runtime resource editing" description="The host can add a newly published namespace without rebuilding the application.">
        <div class="flex flex-wrap items-center gap-space-md">
          <button class="rounded-md border border-border px-space-md py-space-sm" disabled={runtimeReady} type="button" onclick={addRuntimeBundle}>
            {runtimeReady ? 'Runtime bundle registered' : 'Register edited text'}
          </button>
          <span>{t('runtime:editor.saved')}</span>
          <span class="text-sm text-muted-foreground">revision: {$snapshot.revision ?? 'local'}</span>
        </div>
      </Card>
    </div>
  </div>
</main>
