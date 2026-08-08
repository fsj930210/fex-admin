export type ThemeAttribute = 'class' | `data-${string}`
export type ThemeScope = 'root' | 'local' | 'inherit'
export type ColorScheme = 'light' | 'dark'
export type ThemeValue = string

export interface ThemeControllerOptions {
  themes?: ThemeValue[] | undefined
  defaultTheme?: ThemeValue | undefined
  forcedTheme?: ThemeValue | undefined
  enableSystem?: boolean | undefined
  enableColorScheme?: boolean | undefined
  attribute?: ThemeAttribute | undefined
  storageKey?: string | undefined
  colorSchemeMap?: Record<ThemeValue, ColorScheme> | undefined
  systemTheme?: ColorScheme | undefined
}

export interface ThemeSnapshot {
  theme: ThemeValue
  themes: ThemeValue[]
  resolvedTheme: ThemeValue
  forcedTheme?: ThemeValue | undefined
  systemTheme?: ColorScheme | undefined
}

export interface ThemeController {
  getSnapshot: () => ThemeSnapshot
  subscribe: (listener: () => void) => () => void
  setTheme: (theme: ThemeValue | ((prevTheme: ThemeValue) => ThemeValue)) => void
  setForcedTheme: (theme?: ThemeValue) => void
  setSystemTheme: (theme: ColorScheme) => void
  syncStoredTheme: (theme?: ThemeValue | null) => void
  setOptions: (options: Partial<ThemeControllerOptions>) => void
  applyTo: (element: HTMLElement) => void
}
