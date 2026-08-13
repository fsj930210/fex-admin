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
import {
  createMemo,
  createUniqueId,
  For,
  Show,
  splitProps,
  type JSX,
  type ParentProps,
} from 'solid-js'
export interface ProgressProps extends ParentProps<JSX.HTMLAttributes<HTMLDivElement>> {
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
}
export function Progress(props: ProgressProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
    'value',
    'min',
    'max',
    'variant',
    'status',
    'size',
    'thickness',
    'linecap',
    'trackLinecap',
    'color',
    'trackColor',
    'gapDegree',
    'gapPlacement',
    'showValue',
  ])
  const value = () => (local.value === undefined ? 0 : local.value)
  const n = createMemo(() => normalizeProgressValue(value(), local.min, local.max))
  const g = createMemo(() =>
    getProgressGeometry({
      value: value(),
      min: local.min,
      max: local.max,
      size: local.size,
      thickness: local.thickness,
      variant: local.variant,
      gapDegree: local.gapDegree,
    }),
  )
  const stops = createMemo(() => getProgressGradientStops(local.color))
  const id = `progress-${createUniqueId()}`
  const thickness = () => local.thickness ?? 8
  const statusColor = () =>
    local.status === 'success'
      ? 'var(--success)'
      : local.status === 'error'
        ? 'var(--danger)'
        : local.status === 'info'
          ? 'var(--info)'
          : local.status === 'warning'
            ? 'var(--warning)'
          : 'var(--primary)'
  const circleStroke = () =>
    stops() ? `url(#${id})` : typeof local.color === 'string' ? local.color : statusColor()
  const circleTrackStroke = () => local.trackColor ?? 'var(--progress-remaining)'
  const resolvedLinecap = () => local.linecap ?? 'round'
  const resolvedTrackLinecap = () => local.trackLinecap ?? resolvedLinecap()
  const display = () =>
    local.children ?? (n().percentage === null ? '' : `${Math.round(n().percentage! * 100)}%`)
  const variant = () => local.variant ?? 'line'
  const rotation = () =>
    ({ bottom: 0, top: 180, start: 90, end: -90 })[local.gapPlacement ?? 'bottom']
  const circlePercentage = () => (g().percentage ?? 0.25) * g().arcRatio * 100
  const circleStartAngle = () => g().rotation + rotation()
  const circleEndAngle = () => circleStartAngle() + circlePercentage() * 3.6
  const circlePoint = (angle: number) => {
    const radians = (angle * Math.PI) / 180
    return {
      left: `${g().center + g().radius * Math.sin(radians) - thickness() / 2}px`,
      top: `${g().center - g().radius * Math.cos(radians) - thickness() / 2}px`,
    }
  }
  const circleStartColor = () =>
    stops()?.[0]?.[1] ?? (typeof local.color === 'string' ? local.color : statusColor())
  const circleEndColor = () =>
    stops()?.[stops()!.length - 1]?.[1] ??
    (typeof local.color === 'string' ? local.color : statusColor())
  const circleBackground = () => {
    const percentage = circlePercentage()
    const arc = g().arcRatio * 100
    const fill = stops()
      ? stops()!
          .map(([offset, value]) => `${value} ${(Number.parseFloat(offset) / 100) * percentage}%`)
          .join(', ')
      : `${typeof local.color === 'string' ? local.color : statusColor()} 0 ${percentage}%`
    return `conic-gradient(from ${g().rotation + rotation()}deg, ${fill}, ${circleTrackStroke()} ${percentage}% ${arc}%, transparent ${arc}% 100%)`
  }
  const linePercentage = () => (n().percentage ?? 0.25) * 100
  const lineTrackRadius = () => (resolvedTrackLinecap() === 'round' ? '9999px' : '0px')
  const lineRangeRadius = () => (resolvedLinecap() === 'round' ? '9999px' : '0px')
  const lineWidth = () =>
    resolvedLinecap() === 'square'
      ? `min(100%, calc(${linePercentage()}% + ${(local.thickness ?? 4) / 2}px))`
      : `${linePercentage()}%`
  return (
    <div
      {...rest}
      role="progressbar"
      aria-valuemin={n().min}
      aria-valuemax={n().max}
      aria-valuenow={n().value ?? undefined}
      data-slot="progress"
      data-variant={variant()}
      data-state={g().state}
      class={cn(progressRootClassName, variant() === 'line' && 'w-full', local.class)}
    >
      <Show
        when={variant() === 'line'}
        fallback={
          <>
            <svg
              aria-hidden="true"
              data-slot="progress-indicator"
              class={progressCircleClassName}
              width={local.size ?? 48}
              height={local.size ?? 48}
              viewBox={`0 0 ${local.size ?? 48} ${local.size ?? 48}`}
              style={{ transform: `rotate(${rotation()}deg)` }}
            >
              <defs>
                <Show when={stops()}>
                  <linearGradient id={id}>
                    <For each={stops()!}>
                      {(stop) => <stop offset={stop[0]} stop-color={stop[1]} />}
                    </For>
                  </linearGradient>
                </Show>
              </defs>
              <circle
                class={progressCircleTrackClassName}
                cx={g().center}
                cy={g().center}
                r={g().radius}
                fill="none"
                stroke={circleTrackStroke()}
                stroke-width={thickness()}
                stroke-linecap={resolvedTrackLinecap()}
                pathLength={100}
                stroke-dasharray={g().trackDasharray}
                transform={`rotate(${g().rotation} ${g().center} ${g().center})`}
              />
              <circle
                data-state={g().state}
                data-status={local.status ?? 'normal'}
                class={progressCircleRangeClassName}
                cx={g().center}
                cy={g().center}
                r={g().radius}
                fill="none"
                stroke={circleStroke()}
                stroke-width={thickness()}
                stroke-linecap={resolvedLinecap()}
                pathLength={100}
                stroke-dasharray={g().rangeDasharray}
                stroke-dashoffset={g().dashOffset}
                transform={`rotate(${g().rotation} ${g().center} ${g().center})`}
              />
            </svg>
            <Show when={g().percentage !== null}>
              <span
                aria-hidden="true"
                class="pointer-events-none absolute rounded-full"
                style={{
                  width: `${local.size ?? 48}px`,
                  height: `${local.size ?? 48}px`,
                  background: circleBackground(),
                  mask: `radial-gradient(farthest-side, transparent calc(100% - ${thickness()}px), #000 calc(100% - ${thickness()}px))`,
                  '-webkit-mask': `radial-gradient(farthest-side, transparent calc(100% - ${thickness()}px), #000 calc(100% - ${thickness()}px))`,
                }}
              />
              <Show when={resolvedLinecap() === 'round' && circlePercentage() > 0}>
                <span
                  aria-hidden="true"
                  class="pointer-events-none absolute rounded-full"
                  style={{
                    ...circlePoint(circleStartAngle()),
                    width: `${thickness()}px`,
                    height: `${thickness()}px`,
                    background: circleStartColor(),
                  }}
                />
                <span
                  aria-hidden="true"
                  class="pointer-events-none absolute rounded-full"
                  style={{
                    ...circlePoint(circleEndAngle()),
                    width: `${thickness()}px`,
                    height: `${thickness()}px`,
                    background: circleEndColor(),
                  }}
                />
              </Show>
            </Show>
            <Show when={local.showValue}>
              <span class={progressValueClassName}>{display()}</span>
            </Show>
          </>
        }
      >
        <div
          data-slot="progress-track"
          class={progressLineClassName}
          style={{
            background: local.trackColor,
            height: `${thickness()}px`,
            'border-radius': lineTrackRadius(),
          }}
        >
          <div
            data-slot="progress-range"
            data-state={g().state}
            data-status={local.status ?? 'normal'}
            class={progressLineRangeClassName}
            style={{
              width: lineWidth(),
              'border-radius': lineRangeRadius(),
              background: getLinearProgressBackground(local.color),
            }}
          />
        </div>
        <Show when={local.showValue}>
          <span class="ms-2 shrink-0">{display()}</span>
        </Show>
      </Show>
    </div>
  )
}
