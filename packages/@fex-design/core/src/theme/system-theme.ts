import { THEME_MEDIA } from './constants'
import type { ColorScheme } from './types'

export function getSystemTheme(media?: MediaQueryListEvent | MediaQueryList): ColorScheme {
  if (!media && typeof window === 'undefined') return 'light'

  const query = media ?? window.matchMedia(THEME_MEDIA)
  return query.matches ? 'dark' : 'light'
}
