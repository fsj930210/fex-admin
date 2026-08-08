import type { ThemeController, ThemeSnapshot } from '@fex-design/core/theme/types'
import type { Readable } from 'svelte/store'

export interface ThemeProviderContext {
  controller: ThemeController
  snapshot: Readable<ThemeSnapshot>
}

export const THEME_PROVIDER_CONTEXT = Symbol('ThemeProviderContext')
