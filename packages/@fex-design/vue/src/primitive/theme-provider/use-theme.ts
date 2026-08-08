import { inject } from 'vue'
import { themeProviderContextKey } from './context'

export function useTheme() {
  const context = inject(themeProviderContextKey)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
