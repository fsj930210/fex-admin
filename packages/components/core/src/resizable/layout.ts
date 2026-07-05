import type { ResizablePanelConfig } from './types'

export function normalizePanelLayout(
  panels: ResizablePanelConfig[],
  layout?: number[],
): number[] {
  if (layout?.length === panels.length) {
    return normalizeSum(layout)
  }

  const defaults = panels.map((panel) => panel.defaultSize)
  if (defaults.every((value): value is number => typeof value === 'number')) {
    return normalizeSum(defaults)
  }

  return panels.map(() => 100 / Math.max(1, panels.length))
}

export function resizePanelPair({
  layout,
  panelConfigs,
  handleIndex,
  delta,
}: {
  layout: number[]
  panelConfigs: ResizablePanelConfig[]
  handleIndex: number
  delta: number
}) {
  const next = [...layout]
  const beforeIndex = handleIndex
  const afterIndex = handleIndex + 1
  const before = panelConfigs[beforeIndex]
  const after = panelConfigs[afterIndex]

  if (!before || !after) {
    return layout
  }

  const currentBefore = next[beforeIndex]
  const currentAfter = next[afterIndex]
  if (currentBefore === undefined || currentAfter === undefined) {
    return layout
  }

  const beforeSize = clampSize(currentBefore + delta, before)
  const consumed = beforeSize - currentBefore
  const afterSize = clampSize(currentAfter - consumed, after)
  const returned = currentAfter - consumed - afterSize

  next[beforeIndex] = beforeSize + returned
  next[afterIndex] = afterSize

  return next
}

function clampSize(value: number, panel: ResizablePanelConfig) {
  return Math.min(panel.maxSize ?? 100, Math.max(panel.minSize ?? 0, value))
}

function normalizeSum(values: number[]) {
  const sum = values.reduce((total, value) => total + value, 0)
  if (sum <= 0) {
    return values
  }

  return values.map((value) => (value / sum) * 100)
}
