import { render } from 'solid-js/web'
import { Router } from '@solidjs/router'
import { I18nProvider } from '@fex-design/solid/i18n'
import { App } from './App'
import { i18n, i18nReady } from './i18n'
import '@fex/styles'

async function bootstrap() {
  await i18nReady
  render(
    () => (
      <I18nProvider controller={i18n}>
        <Router>
          <App />
        </Router>
      </I18nProvider>
    ),
    document.querySelector('#root')!,
  )
}

void bootstrap()
