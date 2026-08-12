import type { AnchorTarget } from './types'

export function resolveAnchorTarget(target: AnchorTarget): HTMLElement | null {
  if (typeof target === 'function') return target()
  if (target instanceof HTMLElement) return target

  const id = target.startsWith('#') ? target.slice(1) : target
  const byId = document.getElementById(id)
  if (byId) return byId

  try {
    return document.querySelector<HTMLElement>(target)
  } catch {
    return null
  }
}

export function getAnchorTargetTop(element: HTMLElement, container: Window | HTMLElement) {
  if (container instanceof Window) return element.getBoundingClientRect().top + window.scrollY

  const elementRect = element.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()
  return elementRect.top - containerRect.top + container.scrollTop
}

export function getAnchorScrollTop(container: Window | HTMLElement) {
  return container instanceof Window ? window.scrollY : container.scrollTop
}

export function getAnchorViewportHeight(container: Window | HTMLElement) {
  return container instanceof Window ? window.innerHeight : container.clientHeight
}

export function isAnchorScrolledToEnd(container: Window | HTMLElement) {
  const scrollHeight = container instanceof Window ? document.documentElement.scrollHeight : container.scrollHeight
  return scrollHeight - getAnchorScrollTop(container) - getAnchorViewportHeight(container) <= 2
}

export interface AnchorIndicatorStyle {
  top?: number
  left?: number
  width?: number
  height?: number
}

export function getAnchorIndicatorStyles(
  root: HTMLElement,
  activeKeys: readonly string[],
  orientation: 'vertical' | 'horizontal',
): AnchorIndicatorStyle[] {
  const rootRect = root.getBoundingClientRect()
  const rects = activeKeys.flatMap((key) => {
    const link = root.querySelector<HTMLElement>(`[data-anchor-key="${CSS.escape(key)}"]`)
    return link ? [link.getBoundingClientRect()] : []
  })
  const first = rects[0]
  const last = rects.at(-1)
  if (!first || !last) return []
  return orientation === 'horizontal'
    ? [{ left: first.left - rootRect.left, width: last.right - first.left }]
    : [{ top: first.top - rootRect.top, height: last.bottom - first.top }]
}

export function ensureAnchorLinkVisible(
  root: HTMLElement,
  activeKeys: readonly string[],
  orientation: 'vertical' | 'horizontal',
) {
  if (orientation !== 'horizontal') return
  const key = activeKeys.at(-1)
  if (!key) return
  root.querySelector<HTMLElement>(`[data-anchor-key="${CSS.escape(key)}"]`)?.scrollIntoView({
    block: 'nearest',
    inline: 'nearest',
  })
}
