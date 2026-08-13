import {
  getLinearProgressBackground,
  getProgressGeometry,
  getProgressGradientStops,
  normalizeProgressValue,
} from '@fex-design/core/progress/progress'
import type {
  ProgressColor,
  ProgressLinecap,
  ProgressStatus,
  ProgressVariant,
} from '@fex-design/core/progress/types'
import {
  progressCircleClassName,
  progressCircleRangeClassName,
  progressCircleTrackClassName,
  progressLineClassName,
  progressLineRangeClassName,
  progressRootClassName,
  progressValueClassName,
} from '@fex-design/styles/progress'
import { cn } from '@fex/utils'
import { useId, type ComponentProps, type CSSProperties, type ReactNode } from 'react'

export interface ProgressProps extends Omit<ComponentProps<'div'>, 'color'> {
  value?: number | null
  min?: number
  max?: number
  variant?: ProgressVariant
  status?: ProgressStatus
  size?: number
  thickness?: number
  linecap?: ProgressLinecap
  trackLinecap?: ProgressLinecap
  color?: ProgressColor
  trackColor?: string
  gapDegree?: number
  gapPlacement?: 'top' | 'bottom' | 'start' | 'end'
  showValue?: boolean
  valueContent?: ReactNode
}
export function Progress({
  value = 0,
  min = 0,
  max = 100,
  variant = 'line',
  status = 'normal',
  size = 48,
  thickness = 8,
  linecap = 'round',
  trackLinecap,
  color,
  trackColor,
  gapDegree = 75,
  gapPlacement = 'bottom',
  showValue = false,
  valueContent,
  className,
  style,
  ...props
}: ProgressProps) {
  const normalized = normalizeProgressValue(value, min, max)
  const geometry = getProgressGeometry({ value, min, max, size, thickness, variant, gapDegree })
  const gradientId = `progress-${useId().replaceAll(':', '')}`
  const stops = getProgressGradientStops(color)
  const statusColor =
    status === 'success'
      ? 'var(--success)'
      : status === 'error'
        ? 'var(--danger)'
        : status === 'info'
          ? 'var(--info)'
          : status === 'warning'
            ? 'var(--warning)'
          : 'var(--primary)'
  const circleStroke = stops
    ? `url(#${gradientId})`
    : typeof color === 'string'
      ? color
      : statusColor
  const circleTrackStroke = trackColor ?? 'var(--progress-remaining)'
  const placementRotation = { bottom: 0, top: 180, start: 90, end: -90 }[gapPlacement]
  const circlePercentage = (geometry.percentage ?? 0.25) * geometry.arcRatio * 100
  const circleArc = geometry.arcRatio * 100
  const resolvedTrackLinecap = trackLinecap ?? linecap
  const circleStartAngle = geometry.rotation + placementRotation
  const circleEndAngle = circleStartAngle + circlePercentage * 3.6
  const getCirclePoint = (angle: number) => {
    const radians = (angle * Math.PI) / 180
    return {
      left: geometry.center + geometry.radius * Math.sin(radians) - thickness / 2,
      top: geometry.center - geometry.radius * Math.cos(radians) - thickness / 2,
    }
  }
  const circleFill = stops
    ? stops
        .map(
          ([offset, stopColor]) =>
            `${stopColor} ${(Number.parseFloat(offset) / 100) * circlePercentage}%`,
        )
        .join(', ')
    : `${typeof color === 'string' ? color : statusColor} 0 ${circlePercentage}%`
  const circleBackground = `conic-gradient(from ${geometry.rotation + placementRotation}deg, ${circleFill}, ${circleTrackStroke} ${circlePercentage}% ${circleArc}%, transparent ${circleArc}% 100%)`
  const circleStartColor = stops?.[0]?.[1] ?? (typeof color === 'string' ? color : statusColor)
  const circleEndColor =
    stops?.[stops.length - 1]?.[1] ?? (typeof color === 'string' ? color : statusColor)
  const display =
    valueContent ??
    (normalized.percentage === null ? null : `${Math.round(normalized.percentage * 100)}%`)
  const linePercentage = (normalized.percentage ?? 0.25) * 100
  const lineTrackRadius = resolvedTrackLinecap === 'round' ? '9999px' : '0px'
  const lineRangeRadius = linecap === 'round' ? '9999px' : '0px'
  const lineWidth =
    linecap === 'square'
      ? `min(100%, calc(${linePercentage}% + ${thickness / 2}px))`
      : `${linePercentage}%`
  const aria = {
    role: 'progressbar',
    'aria-valuemin': normalized.min,
    'aria-valuemax': normalized.max,
    'aria-valuenow': normalized.value ?? undefined,
    'aria-valuetext': typeof display === 'string' ? display : undefined,
  }
  if (variant === 'line')
    return (
      <div
        {...props}
        {...aria}
        data-slot="progress"
        data-variant={variant}
        data-status={status}
        data-state={geometry.state}
        className={cn(progressRootClassName, 'w-full', className)}
        style={style}
      >
        <div
          data-slot="progress-track"
          className={progressLineClassName}
          style={{ background: trackColor, height: thickness, borderRadius: lineTrackRadius }}
        >
          <div
            data-slot="progress-range"
            data-state={geometry.state}
            data-status={status}
            className={progressLineRangeClassName}
            style={
              {
                width: lineWidth,
                borderRadius: lineRangeRadius,
                background: getLinearProgressBackground(color),
              } as CSSProperties
            }
          />
        </div>
        {showValue ? <span className="ms-2 shrink-0">{display}</span> : null}
      </div>
    )
  return (
    <div
      {...props}
      {...aria}
      data-slot="progress"
      data-variant={variant}
      data-status={status}
      data-state={geometry.state}
      className={cn(progressRootClassName, className)}
      style={style}
    >
      <svg
        aria-hidden="true"
        data-slot="progress-indicator"
        className={progressCircleClassName}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: `rotate(${placementRotation}deg)` }}
      >
        <defs>
          {stops ? (
            <linearGradient id={gradientId}>
              {stops.map(([offset, stopColor]) => (
                <stop key={offset} offset={offset} stopColor={stopColor} />
              ))}
            </linearGradient>
          ) : null}
        </defs>
        <circle
          className={progressCircleTrackClassName}
          cx={geometry.center}
          cy={geometry.center}
          r={geometry.radius}
          fill="none"
          stroke={circleTrackStroke}
          strokeWidth={thickness}
          strokeLinecap={resolvedTrackLinecap}
          pathLength={100}
          strokeDasharray={geometry.trackDasharray}
          transform={`rotate(${geometry.rotation} ${geometry.center} ${geometry.center})`}
        />
        <circle
          data-state={geometry.state}
          data-status={status}
          className={progressCircleRangeClassName}
          cx={geometry.center}
          cy={geometry.center}
          r={geometry.radius}
          fill="none"
          stroke={circleStroke}
          strokeWidth={thickness}
          strokeLinecap={linecap}
          pathLength={100}
          strokeDasharray={geometry.rangeDasharray}
          strokeDashoffset={geometry.dashOffset}
          transform={`rotate(${geometry.rotation} ${geometry.center} ${geometry.center})`}
        />
      </svg>
      {geometry.percentage !== null ? (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full"
            style={{
              width: size,
              height: size,
              background: circleBackground,
              mask: `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px))`,
              WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px))`,
            }}
          />
          {linecap === 'round' && circlePercentage > 0 ? (
            <>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute rounded-full"
                style={{
                  ...getCirclePoint(circleStartAngle),
                  width: thickness,
                  height: thickness,
                  background: circleStartColor,
                }}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute rounded-full"
                style={{
                  ...getCirclePoint(circleEndAngle),
                  width: thickness,
                  height: thickness,
                  background: circleEndColor,
                }}
              />
            </>
          ) : null}
        </>
      ) : null}
      {showValue ? <span className={progressValueClassName}>{display}</span> : null}
    </div>
  )
}
