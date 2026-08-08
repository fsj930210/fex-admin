import { createThemeController } from '@fex-design/core/theme/create-theme-controller'
import { THEME_MEDIA } from '@fex-design/core/theme/constants'
import { getSystemTheme } from '@fex-design/core/theme/system-theme'
import type { ThemeControllerOptions, ThemeScope } from '@fex-design/core/theme/types'
import { Dynamic } from 'solid-js/web'
import {
  createComponent,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  useContext,
  type JSX,
  type ParentProps,
} from 'solid-js'
import { ThemeProviderContext, type ThemeProviderContext as ThemeProviderContextValue } from './context'

export interface ThemeProviderProps extends ParentProps, ThemeControllerOptions {
  scope?: ThemeScope
  class?: string
  as?: keyof JSX.IntrinsicElements
}

export function ThemeProvider(props: ThemeProviderProps) {
  const parentContext = useContext(ThemeProviderContext)
  const scope = () => props.scope ?? 'root'
  if (scope() === 'root' && parentContext) {
    throw new Error("ThemeProvider scope='root' cannot be nested.")
  }
  if (scope() === 'root' && !props.storageKey && !props.forcedTheme) {
    throw new Error("ThemeProvider scope='root' requires storageKey unless forcedTheme is provided.")
  }
  if (scope() === 'inherit' && !parentContext) {
    throw new Error("ThemeProvider scope='inherit' requires a parent provider.")
  }
  if (scope() === 'inherit' && props.forcedTheme) {
    throw new Error("ThemeProvider scope='inherit' cannot use forcedTheme.")
  }

  const isInheritScope = scope() === 'inherit'
  const ownController = isInheritScope
    ? undefined
    : createThemeController({
        attribute: props.attribute ?? 'class',
        colorSchemeMap: props.colorSchemeMap,
        defaultTheme: props.defaultTheme ?? 'light',
        enableColorScheme: props.enableColorScheme ?? false,
        enableSystem: props.enableSystem ?? false,
        forcedTheme: props.forcedTheme,
        storageKey: props.storageKey,
        systemTheme: props.systemTheme,
        themes: props.themes ?? ['light', 'dark'],
      })
  const controller = ownController ?? parentContext!.controller
  const [ownSnapshot, setOwnSnapshot] = createSignal(controller.getSnapshot())
  const snapshot = isInheritScope ? parentContext!.snapshot : ownSnapshot
  let containerElement: HTMLElement | undefined

  const syncTheme = () => {
    if (isInheritScope) return
    setOwnSnapshot(controller.getSnapshot())
    const element = scope() === 'root' ? document.documentElement : containerElement
    if (element) controller.applyTo(element)
  }

  const unsubscribe = isInheritScope ? undefined : controller.subscribe(syncTheme)
  if (unsubscribe) onCleanup(unsubscribe)

  createEffect(() => {
    if (isInheritScope) return
    controller.setOptions({
      attribute: props.attribute,
      colorSchemeMap: props.colorSchemeMap,
      defaultTheme: props.defaultTheme,
      enableColorScheme: props.enableColorScheme,
      enableSystem: props.enableSystem,
      forcedTheme: props.forcedTheme,
      storageKey: props.storageKey,
      themes: props.themes,
    })
  })

  onMount(() => {
    if (isInheritScope) return
    syncTheme()
    if (props.enableSystem) {
      const media = window.matchMedia(THEME_MEDIA)
      const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
        controller.setSystemTheme(getSystemTheme(event))
      }
      handleChange(media)
      media.addEventListener('change', handleChange)
      onCleanup(() => media.removeEventListener('change', handleChange))
    }
    if (props.storageKey && !props.forcedTheme) {
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === props.storageKey) controller.syncStoredTheme(event.newValue)
      }
      window.addEventListener('storage', handleStorageChange)
      onCleanup(() => window.removeEventListener('storage', handleStorageChange))
    }
  })

  const context: ThemeProviderContextValue = { controller, snapshot }
  if (scope() === 'local') {
    return createComponent(ThemeProviderContext.Provider, {
      value: context,
      get children() {
        return createComponent(Dynamic, {
          component: props.as ?? 'div',
          ref: (element: HTMLElement) => {
            containerElement = element
            syncTheme()
          },
          class: props.class,
          'data-theme-scope': props.storageKey,
          get children() {
            return props.children
          },
        })
      },
    })
  }

  return createComponent(ThemeProviderContext.Provider, {
    value: scope() === 'inherit' ? parentContext! : context,
    get children() {
      return props.children
    },
  })
}
