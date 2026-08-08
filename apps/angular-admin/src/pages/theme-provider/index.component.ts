import { ThemeProvider } from '@fex-design/angular/primitive/theme-provider'
import { Card } from '@fex-design/angular/ui/card'
import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ThemeStatusCardComponent } from './theme-status-card.component'

@Component({
  selector: 'fex-theme-provider-page',
  standalone: true,
  imports: [RouterLink, ThemeProvider, Card, ThemeStatusCardComponent],
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeProviderComponent {
  protected readonly inheritedTheme = signal<'light' | 'dark'>('dark')
  protected readonly innerTheme = signal<'light' | 'dark'>('light')
  protected readonly customTheme = signal<'light' | 'dark' | 'admin-blue'>('admin-blue')
  protected readonly customThemeOptions = ['admin-blue', 'light', 'dark'] as const
  protected readonly customColorSchemeMap = { 'admin-blue': 'light' } as const

  protected toggleInheritedTheme() {
    this.inheritedTheme.update((theme) => (theme === 'dark' ? 'light' : 'dark'))
  }

  protected toggleInnerTheme() {
    this.innerTheme.update((theme) => (theme === 'dark' ? 'light' : 'dark'))
  }

  protected setCustomTheme(theme: 'light' | 'dark' | 'admin-blue') {
    this.customTheme.set(theme)
  }
}
