<script module lang="ts">
  let nextProgressId = 0
</script>

<script lang="ts">
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
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'color' | 'class'> {
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
    class?: string
    valueContent?: Snippet<[string]>
  }

  let {
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
    class: className,
    valueContent,
    ...rest
  }: Props = $props()

  let normalized = $derived(normalizeProgressValue(value, min, max))
  let geometry = $derived(getProgressGeometry({ value, min, max, size, thickness, variant, gapDegree }))
  let stops = $derived(getProgressGradientStops(color))
  let gradientId = `progress-${nextProgressId++}`
  let display = $derived(normalized.percentage === null ? '' : `${Math.round(normalized.percentage * 100)}%`)
  let rotation = $derived({ bottom: 0, top: 180, start: 90, end: -90 }[gapPlacement])
  let stroke = $derived(
    stops
      ? `url(#${gradientId})`
      : typeof color === 'string'
        ? color
        : status === 'success'
          ? 'var(--success)'
          : status === 'error'
            ? 'var(--danger)'
            : status === 'info'
              ? 'var(--info)'
              : status === 'warning'
                ? 'var(--warning)'
              : 'var(--primary)',
  )
  let trackStroke = $derived(trackColor ?? 'var(--progress-remaining)')
  let resolvedTrackLinecap = $derived(trackLinecap ?? linecap)
  let circlePercentage = $derived((geometry.percentage ?? 0.25) * geometry.arcRatio * 100)
  let circleStartAngle = $derived(geometry.rotation + rotation)
  let circleEndAngle = $derived(circleStartAngle + circlePercentage * 3.6)
  const getCirclePoint = (angle: number) => {
    const radians = (angle * Math.PI) / 180
    return {
      left: `${geometry.center + geometry.radius * Math.sin(radians) - thickness / 2}px`,
      top: `${geometry.center - geometry.radius * Math.cos(radians) - thickness / 2}px`,
    }
  }
  let circleStartColor = $derived(stops?.[0]?.[1] ?? (typeof color === 'string' ? color : stroke))
  let circleEndColor = $derived(stops?.[stops.length - 1]?.[1] ?? (typeof color === 'string' ? color : stroke))
  let linePercentage = $derived((normalized.percentage ?? 0.25) * 100)
  let lineTrackRadius = $derived(resolvedTrackLinecap === 'round' ? '9999px' : '0px')
  let lineRangeRadius = $derived(linecap === 'round' ? '9999px' : '0px')
  let lineWidth = $derived(
    linecap === 'square'
      ? `min(100%, calc(${linePercentage}% + ${thickness / 2}px))`
      : `${linePercentage}%`,
  )
  let circleBackground = $derived.by(() => {
    const percentage = circlePercentage
    const arc = geometry.arcRatio * 100
    const fill = stops
      ? stops
          .map(([offset, value]) => `${value} ${(Number.parseFloat(offset) / 100) * percentage}%`)
          .join(', ')
      : `${typeof color === 'string' ? color : stroke} 0 ${percentage}%`
    return `conic-gradient(from ${geometry.rotation + rotation}deg, ${fill}, ${trackStroke} ${percentage}% ${arc}%, transparent ${arc}% 100%)`
  })
</script>

<div
  {...rest}
  role="progressbar"
  aria-valuemin={normalized.min}
  aria-valuemax={normalized.max}
  aria-valuenow={normalized.value ?? undefined}
  data-slot="progress"
  data-variant={variant}
  data-status={status}
  data-state={geometry.state}
  class={cn(progressRootClassName, variant === 'line' && 'w-full', className)}
>
  {#if variant === 'line'}
    <div data-slot="progress-track" class={progressLineClassName} style:background={trackColor} style:height={`${thickness}px`} style:border-radius={lineTrackRadius}>
      <div data-slot="progress-range" data-status={status} class={progressLineRangeClassName} style:width={lineWidth} style:border-radius={lineRangeRadius} style:background={getLinearProgressBackground(color)}></div>
    </div>
    {#if showValue}<span class="ms-2 shrink-0">{#if valueContent}{@render valueContent(display)}{:else}{display}{/if}</span>{/if}
  {:else}
    <svg aria-hidden="true" class={progressCircleClassName} width={size} height={size} viewBox={`0 0 ${size} ${size}`} style:transform={`rotate(${rotation}deg)`}>
      <defs>{#if stops}<linearGradient id={gradientId}>{#each stops as stop (stop[0])}<stop offset={stop[0]} stop-color={stop[1]}></stop>{/each}</linearGradient>{/if}</defs>
      <circle class={progressCircleTrackClassName} cx={geometry.center} cy={geometry.center} r={geometry.radius} fill="none" stroke={trackStroke} stroke-width={thickness} stroke-linecap={resolvedTrackLinecap} pathLength="100" stroke-dasharray={geometry.trackDasharray} transform={`rotate(${geometry.rotation} ${geometry.center} ${geometry.center})`}></circle>
      <circle data-state={geometry.state} data-status={status} class={progressCircleRangeClassName} cx={geometry.center} cy={geometry.center} r={geometry.radius} fill="none" stroke={stroke} stroke-width={thickness} stroke-linecap={linecap} pathLength="100" stroke-dasharray={geometry.rangeDasharray} stroke-dashoffset={geometry.dashOffset} transform={`rotate(${geometry.rotation} ${geometry.center} ${geometry.center})`}></circle>
    </svg>
    {#if geometry.percentage !== null}<span aria-hidden="true" class="pointer-events-none absolute rounded-full" style:width={`${size}px`} style:height={`${size}px`} style:background={circleBackground} style:mask={`radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px))`} style:-webkit-mask={`radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px))`}></span>{#if linecap === 'round' && circlePercentage > 0}<span aria-hidden="true" class="pointer-events-none absolute rounded-full" style:left={getCirclePoint(circleStartAngle).left} style:top={getCirclePoint(circleStartAngle).top} style:width={`${thickness}px`} style:height={`${thickness}px`} style:background={circleStartColor}></span><span aria-hidden="true" class="pointer-events-none absolute rounded-full" style:left={getCirclePoint(circleEndAngle).left} style:top={getCirclePoint(circleEndAngle).top} style:width={`${thickness}px`} style:height={`${thickness}px`} style:background={circleEndColor}></span>{/if}{/if}
    {#if showValue}<span class={progressValueClassName}>{#if valueContent}{@render valueContent(display)}{:else}{display}{/if}</span>{/if}
  {/if}
</div>
