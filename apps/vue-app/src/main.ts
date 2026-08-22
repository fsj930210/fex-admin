import { createApp } from 'vue'
import App from './App.vue'
import { router } from './routes'
import { createI18nPlugin } from '@fex-design/vue/i18n'
import '@fex/styles'
import { i18n, i18nReady } from './i18n'

async function bootstrap() {
  await i18nReady
  createApp(App).use(createI18nPlugin(i18n)).use(router).mount('#root')
}

void bootstrap()
