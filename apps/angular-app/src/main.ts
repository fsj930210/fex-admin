import 'zone.js'
import { bootstrapApplication } from '@angular/platform-browser'
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router'
import { AppComponent } from './app.component'
import { routes } from './routes'
import { provideI18n } from '@fex-design/angular/i18n'
import { i18n, i18nReady } from './i18n'

async function bootstrap() {
  await i18nReady
  await bootstrapApplication(AppComponent, {
    providers: [provideI18n(i18n), provideRouter(routes, withEnabledBlockingInitialNavigation())],
  })
}

void bootstrap()
