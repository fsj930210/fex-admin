import { ThemeProvider } from '@fex-design/angular/primitive/theme-provider'
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'

@Component({
  selector: 'fex-theme-status-card',
  standalone: true,
  templateUrl: './theme-status-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeStatusCardComponent {
  readonly provider = input.required<ThemeProvider>()
  readonly title = input.required<string>()

  protected readonly snapshot = computed(() => this.provider().snapshot())
  protected readonly canSwitchTheme = computed(() => {
    const snapshot = this.snapshot()
    return !snapshot.forcedTheme && snapshot.themes.includes('light') && snapshot.themes.includes('dark')
  })
  protected readonly nextTheme = computed(() => (this.snapshot().resolvedTheme === 'dark' ? 'light' : 'dark'))

  protected switchTheme() {
    this.provider().setTheme(this.nextTheme())
  }
}
