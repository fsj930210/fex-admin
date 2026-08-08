import { colorSchemes, defaultThemes } from './constants'
import { applyThemeToElement } from './apply-theme'
import { getStoredTheme, saveTheme } from './storage'
import { getSystemTheme } from './system-theme'
import { getAvailableThemes, getFallbackTheme, resolveTheme } from './resolve-theme'
import type {
  ColorScheme,
  ThemeController,
  ThemeControllerOptions,
  ThemeSnapshot,
  ThemeValue,
} from './types'

function createColorSchemeMap(options: ThemeControllerOptions) {
  return {
    ...Object.fromEntries(colorSchemes.map((item) => [item, item])),
    ...options.colorSchemeMap,
  } as Record<string, ColorScheme>
}

function mergeOptions(
  currentOptions: Required<Pick<ThemeControllerOptions, 'themes' | 'defaultTheme' | 'attribute'>> &
    Omit<ThemeControllerOptions, 'themes' | 'defaultTheme' | 'attribute'>,
  nextOptions: Partial<ThemeControllerOptions>,
) {
  return {
    ...currentOptions,
    attribute: nextOptions.attribute ?? currentOptions.attribute,
    defaultTheme: nextOptions.defaultTheme ?? currentOptions.defaultTheme,
    enableColorScheme: nextOptions.enableColorScheme ?? currentOptions.enableColorScheme,
    enableSystem: nextOptions.enableSystem ?? currentOptions.enableSystem,
    themes: nextOptions.themes ?? currentOptions.themes,
    ...('colorSchemeMap' in nextOptions ? { colorSchemeMap: nextOptions.colorSchemeMap } : {}),
    ...('forcedTheme' in nextOptions ? { forcedTheme: nextOptions.forcedTheme } : {}),
    ...('storageKey' in nextOptions ? { storageKey: nextOptions.storageKey } : {}),
    ...('systemTheme' in nextOptions ? { systemTheme: nextOptions.systemTheme } : {}),
  }
}

export function createThemeController(initialOptions: ThemeControllerOptions = {}): ThemeController {
  const defaultOptions: Required<Pick<ThemeControllerOptions, 'themes' | 'defaultTheme' | 'attribute'>> &
    Omit<ThemeControllerOptions, 'themes' | 'defaultTheme' | 'attribute'> = {
    attribute: 'class',
    defaultTheme: 'light',
    themes: defaultThemes,
  }
  let options = mergeOptions(defaultOptions, initialOptions)
  let systemTheme = options.systemTheme ?? getSystemTheme()
  let selectedTheme: ThemeValue = getInitialTheme(options)
  let previousAppliedTheme: string | undefined
  let snapshot = createSnapshot()
  const listeners = new Set<() => void>()

  function getInitialTheme(currentOptions: ThemeControllerOptions): ThemeValue {
    const availableThemes = getAvailableThemes(currentOptions.themes, currentOptions.enableSystem)
    if (currentOptions.forcedTheme) return currentOptions.forcedTheme

    if (currentOptions.storageKey) {
      const storedTheme = getStoredTheme(currentOptions.storageKey)
      if (storedTheme && availableThemes.includes(storedTheme)) return storedTheme
    }

    const fallback = getFallbackTheme(availableThemes, currentOptions.defaultTheme ?? 'light')
    if (fallback === 'system' && !currentOptions.enableSystem) {
      return currentOptions.themes?.[0] ?? defaultThemes[0] ?? 'light'
    }
    return fallback
  }

  function createSnapshot(): ThemeSnapshot {
    const availableThemes = getAvailableThemes(options.themes, options.enableSystem)
    const theme = options.forcedTheme ?? selectedTheme
    return {
      ...(options.forcedTheme === undefined ? {} : { forcedTheme: options.forcedTheme }),
      resolvedTheme: resolveTheme({ forcedTheme: options.forcedTheme, systemTheme, theme }),
      ...(options.enableSystem ? { systemTheme } : {}),
      theme,
      themes: availableThemes,
    }
  }

  function emit() {
    snapshot = createSnapshot()
    for (const listener of listeners) listener()
  }

  function setSelectedTheme(nextTheme: ThemeValue, save: boolean) {
    const availableThemes = getAvailableThemes(options.themes, options.enableSystem)
    if (!availableThemes.includes(nextTheme)) return
    if (selectedTheme === nextTheme && !options.forcedTheme) return
    selectedTheme = nextTheme
    if (save && options.storageKey) saveTheme(options.storageKey, nextTheme)
    emit()
  }

  return {
    applyTo(element) {
      applyThemeToElement({
        attribute: options.attribute ?? 'class',
        colorSchemeMap: createColorSchemeMap(options),
        element,
        enableColorScheme: options.enableColorScheme ?? false,
        previousTheme: previousAppliedTheme,
        theme: snapshot.resolvedTheme,
        themes: options.themes ?? defaultThemes,
      })
      previousAppliedTheme = snapshot.resolvedTheme
    },
    getSnapshot() {
      return snapshot
    },
    setForcedTheme(theme) {
      if (options.forcedTheme === theme) return
      options = { ...options, ...(theme === undefined ? { forcedTheme: undefined } : { forcedTheme: theme }) }
      if (!options.forcedTheme) {
        const availableThemes = getAvailableThemes(options.themes, options.enableSystem)
        if (!availableThemes.includes(selectedTheme)) {
          selectedTheme = getFallbackTheme(availableThemes, options.defaultTheme ?? 'light')
        }
      }
      emit()
    },
    setOptions(nextOptions) {
      options = mergeOptions(options, nextOptions)
      if (nextOptions.systemTheme) systemTheme = nextOptions.systemTheme

      const availableThemes = getAvailableThemes(options.themes, options.enableSystem)
      if (!options.forcedTheme && !availableThemes.includes(selectedTheme)) {
        selectedTheme = getFallbackTheme(availableThemes, options.defaultTheme ?? 'light')
      }
      emit()
    },
    setSystemTheme(theme) {
      if (systemTheme === theme) return
      systemTheme = theme
      emit()
    },
    setTheme(value) {
      if (options.forcedTheme) return
      const nextTheme = typeof value === 'function' ? value(selectedTheme) : value
      setSelectedTheme(nextTheme, true)
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    syncStoredTheme(theme) {
      if (options.forcedTheme) return
      const availableThemes = getAvailableThemes(options.themes, options.enableSystem)
      if (theme && availableThemes.includes(theme)) {
        setSelectedTheme(theme, false)
      } else {
        setSelectedTheme(getFallbackTheme(availableThemes, options.defaultTheme ?? 'light'), false)
      }
    },
  }
}
