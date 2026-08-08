import type { ThemeController, ThemeSnapshot } from '@fex-design/core/theme/types'
import { createContext, type Accessor } from 'solid-js'

export interface ThemeProviderContext {
  controller: ThemeController
  snapshot: Accessor<ThemeSnapshot>
}

export const ThemeProviderContext = createContext<ThemeProviderContext>()
