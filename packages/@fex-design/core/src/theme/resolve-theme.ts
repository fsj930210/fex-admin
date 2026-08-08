import { defaultThemes } from './constants'
import type { ColorScheme, ThemeValue } from './types'

export function getAvailableThemes(themes = defaultThemes, enableSystem = false) {
  return enableSystem ? [...themes, 'system'] : themes
}

export function getFallbackTheme(themes: ThemeValue[], defaultTheme: ThemeValue) {
  return themes.includes(defaultTheme) ? defaultTheme : themes[0] ?? defaultTheme
}

export function resolveTheme({
  forcedTheme,
  systemTheme,
  theme,
}: {
  theme: ThemeValue
  forcedTheme?: ThemeValue | undefined
  systemTheme: ColorScheme
}) {
  if (forcedTheme) return forcedTheme
  return theme === 'system' ? systemTheme : theme
}
