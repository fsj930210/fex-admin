import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { I18nProvider } from '@fex-design/react/i18n'
import '@fex/styles'
import { App } from './App'
import { i18n, i18nReady } from './i18n'
import './styles.css'

async function bootstrap() {
  await i18nReady
  createRoot(document.querySelector('#root')!).render(
    <StrictMode>
      <I18nProvider controller={i18n}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </I18nProvider>
    </StrictMode>,
  )
}

void bootstrap()
