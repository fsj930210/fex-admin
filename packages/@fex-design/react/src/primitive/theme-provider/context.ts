import { createContext, use } from 'react'
import type { ThemeController, ThemeSnapshot } from '@fex-design/core/theme/types'

export interface ThemeContextValue extends ThemeSnapshot {
  setTheme: ThemeController['setTheme']
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function useThemeContext(componentName = 'useTheme') {
  const context = use(ThemeContext)
  if (context === undefined) {
    throw new Error(`${componentName} must be used within a ThemeProvider`)
  }
  return context
}
