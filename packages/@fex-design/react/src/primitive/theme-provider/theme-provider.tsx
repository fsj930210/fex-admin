'use client'

import { createThemeController } from '@fex-design/core/theme/create-theme-controller'
import { THEME_MEDIA } from '@fex-design/core/theme/constants'
import { getSystemTheme } from '@fex-design/core/theme/system-theme'
import type { ThemeController, ThemeControllerOptions, ThemeScope } from '@fex-design/core/theme/types'
import {
  createElement,
  use,
  useEffect,
  useRef,
  useSyncExternalStore,
  type FC,
  type ReactNode,
} from 'react'
import { ThemeContext, type ThemeContextValue } from './context'

export interface ThemeProviderProps extends ThemeControllerOptions {
  children: ReactNode
  scope?: ThemeScope
  className?: string
  as?: keyof HTMLElementTagNameMap
}

function subscribeTheme(controller: ThemeController) {
  return controller.subscribe
}

function getThemeSnapshot(controller: ThemeController) {
  return controller.getSnapshot
}

type ActiveThemeProviderProps = ThemeProviderProps & {
  scope: Exclude<NonNullable<ThemeProviderProps['scope']>, 'inherit'>
}

const ActiveThemeProvider: FC<ActiveThemeProviderProps> = ({
  as = 'div',
  children,
  className,
  scope,
  ...options
}) => {
  const parentContext = use(ThemeContext)
  const containerRef = useRef<HTMLElement | null>(null)
  const controllerRef = useRef<ThemeController | undefined>(undefined)

  if (scope === 'root' && parentContext) {
    throw new Error("ThemeProvider scope='root' cannot be nested.")
  }

  if (scope === 'root' && !options.storageKey && !options.forcedTheme) {
    throw new Error("ThemeProvider scope='root' requires storageKey unless forcedTheme is provided.")
  }

  if (!controllerRef.current) {
    controllerRef.current = createThemeController(options)
  }

  const controller = controllerRef.current
  const snapshot = useSyncExternalStore(
    subscribeTheme(controller),
    getThemeSnapshot(controller),
    getThemeSnapshot(controller),
  )

  useEffect(() => {
    controller.setOptions(options)
  }, [
    controller,
    options.attribute,
    options.defaultTheme,
    options.enableColorScheme,
    options.enableSystem,
    options.forcedTheme,
    options.storageKey,
    options.themes,
    options.colorSchemeMap,
  ])

  useEffect(() => {
    if (!options.enableSystem) return

    const media = window.matchMedia(THEME_MEDIA)
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      controller.setSystemTheme(getSystemTheme(event))
    }

    handleChange(media)
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [controller, options.enableSystem])

  useEffect(() => {
    if (!options.storageKey || options.forcedTheme) return

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== options.storageKey) return
      controller.syncStoredTheme(event.newValue)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [controller, options.forcedTheme, options.storageKey])

  useEffect(() => {
    const element = scope === 'root' ? document.documentElement : containerRef.current
    if (!element) return
    controller.applyTo(element)
  }, [controller, scope, snapshot])

  const contextValue: ThemeContextValue = {
    ...snapshot,
    setTheme: controller.setTheme,
  }

  return (
    <ThemeContext value={contextValue}>
      {scope === 'root'
        ? children
        : createElement(
            as,
            {
              className,
              'data-theme-scope': options.storageKey,
              ref: containerRef,
            },
            children,
          )}
    </ThemeContext>
  )
}

export const ThemeProvider: FC<ThemeProviderProps> = ({
  children,
  forcedTheme,
  scope = 'root',
  ...props
}) => {
  const parentContext = use(ThemeContext)

  if (scope === 'inherit') {
    if (!parentContext) {
      throw new Error("ThemeProvider scope='inherit' requires a parent provider.")
    }
    if (forcedTheme) {
      throw new Error("ThemeProvider scope='inherit' cannot use forcedTheme.")
    }

    return <ThemeContext value={parentContext}>{children}</ThemeContext>
  }

  return (
    <ActiveThemeProvider forcedTheme={forcedTheme} scope={scope} {...props}>
      {children}
    </ActiveThemeProvider>
  )
}

export type { ColorScheme, ThemeAttribute, ThemeScope, ThemeSnapshot } from '@fex-design/core/theme/types'
