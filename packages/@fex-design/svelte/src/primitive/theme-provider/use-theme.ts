import { getContext } from 'svelte'
import { THEME_PROVIDER_CONTEXT, type ThemeProviderContext } from './context'

export function useTheme() {
  const context = getContext<ThemeProviderContext>(THEME_PROVIDER_CONTEXT)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
