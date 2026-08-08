export function getStoredTheme(storageKey: string) {
  if (typeof localStorage === 'undefined') return undefined

  try {
    return localStorage.getItem(storageKey) || undefined
  } catch {
    return undefined
  }
}

export function saveTheme(storageKey: string, theme: string) {
  if (typeof localStorage === 'undefined') return

  try {
    localStorage.setItem(storageKey, theme)
  } catch {
    return
  }
}
