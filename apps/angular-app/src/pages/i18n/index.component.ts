import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { I18nService } from '@fex-design/angular/i18n'
import { Card } from '@fex-design/angular/ui/card'
import { setI18nDemoMode } from '../../i18n'

const namespaces = ['common', 'admin', 'order']

@Component({
  selector: 'fex-i18n-page',
  standalone: true,
  imports: [Card, RouterLink],
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class I18nPage {
  protected readonly i18n = inject(I18nService)
  protected readonly error = signal('')
  protected readonly runtimeReady = signal(false)

  protected async change(locale: string, mode: 'normal' | 'delayed' | 'failure') {
    this.error.set('')
    setI18nDemoMode(mode)
    const result = await this.i18n.changeLanguage(locale, { namespaces })
    setI18nDemoMode('normal')
    if (result.locale !== locale)
      this.error.set('Remote resource failed. The current locale was preserved.')
  }

  protected addRuntimeBundle() {
    const locale = this.i18n.snapshot().locale
    this.i18n.registerBundle(
      locale,
      'runtime',
      {
        editor: { saved: locale === 'zh-CN' ? '运行时文本已保存' : 'Runtime text saved' },
      },
      'local-edit-1',
    )
    this.runtimeReady.set(true)
  }
}
