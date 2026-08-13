import type { ProgressColor, ProgressGeometry, ProgressVariant } from './types'

export function normalizeProgressValue(value: number | null | undefined, min = 0, max = 100) {
  const safeMin = Number.isFinite(min) ? min : 0
  const safeMax = Number.isFinite(max) && max > safeMin ? max : safeMin + 1
  if (value === null || value === undefined || !Number.isFinite(value))
    return { value: null, min: safeMin, max: safeMax, percentage: null }
  const current = Math.min(safeMax, Math.max(safeMin, value))
  return {
    value: current,
    min: safeMin,
    max: safeMax,
    percentage: (current - safeMin) / (safeMax - safeMin),
  }
}

export function getProgressGeometry(options: {
  value?: number | null
  min?: number
  max?: number
  size?: number
  thickness?: number
  variant?: ProgressVariant
  gapDegree?: number
}): ProgressGeometry {
  const { value, percentage } = normalizeProgressValue(options.value, options.min, options.max)
  const size = Math.max(1, options.size ?? 48)
  const thickness = Math.min(size, Math.max(1, options.thickness ?? 4))
  const radius = Math.max(0, (size - thickness) / 2)
  const circumference = 2 * Math.PI * radius
  const gapDegree =
    options.variant === 'dashboard' ? Math.min(295, Math.max(0, options.gapDegree ?? 75)) : 0
  const arcRatio = (360 - gapDegree) / 360
  const arcLength = circumference * arcRatio
  const rangeLength = arcRatio * (percentage ?? 0.25) * 100
  return {
    value,
    percentage,
    state: percentage === null ? 'indeterminate' : percentage >= 1 ? 'complete' : 'loading',
    radius,
    center: size / 2,
    circumference,
    trackDasharray: `${arcRatio * 100} 100`,
    rangeDasharray: `${rangeLength} 100`,
    dashOffset: 0,
    rotation: options.variant === 'dashboard' ? 90 + gapDegree / 2 : -90,
    arcRatio,
  }
}

export function getProgressGradientStops(
  color: ProgressColor | undefined,
): [string, string][] | null {
  if (!color || typeof color === 'string') return null
  if ('from' in color)
    return [
      ['0%', color.from],
      ['100%', color.to],
    ]
  return Object.entries(color.stops).sort(([a], [b]) => Number.parseFloat(a) - Number.parseFloat(b))
}

export function getLinearProgressBackground(color: ProgressColor | undefined) {
  if (!color) return undefined
  if (typeof color === 'string') return color
  const stops = getProgressGradientStops(color) ?? []
  return `linear-gradient(${color.direction ?? 'to right'}, ${stops.map(([offset, value]) => `${value} ${offset}`).join(', ')})`
}
