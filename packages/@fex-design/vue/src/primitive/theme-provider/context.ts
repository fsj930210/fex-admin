import type { ThemeController, ThemeSnapshot } from '@fex-design/core/theme/types'
import type { InjectionKey, ShallowRef } from 'vue'

export interface ThemeProviderContext {
  controller: ThemeController
  snapshot: ShallowRef<ThemeSnapshot>
}

export const themeProviderContextKey: InjectionKey<ThemeProviderContext> = Symbol('ThemeProviderContext')
