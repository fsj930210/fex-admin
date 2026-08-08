import type { ColorScheme, ThemeAttribute } from './types'

export function applyThemeToElement({
  attribute,
  colorSchemeMap,
  element,
  enableColorScheme,
  previousTheme,
  theme,
  themes,
}: {
  element: HTMLElement
  theme: string
  previousTheme?: string | undefined
  themes: string[]
  attribute: ThemeAttribute
  enableColorScheme: boolean
  colorSchemeMap: Record<string, ColorScheme>
}) {
  if (attribute === 'class') {
    for (const item of themes) {
      element.classList.remove(item)
    }
    if (previousTheme && !themes.includes(previousTheme)) {
      element.classList.remove(previousTheme)
    }
    element.classList.add(theme)
  } else {
    element.setAttribute(attribute, theme)
  }

  if (!enableColorScheme) return

  const colorScheme = colorSchemeMap[theme]
  if (colorScheme) {
    element.style.colorScheme = colorScheme
  } else {
    element.style.removeProperty('color-scheme')
  }
}
