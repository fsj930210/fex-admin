<script setup lang="ts">
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
import { computed, useId, useAttrs } from 'vue'
defineOptions({ inheritAttrs: false })
const props = withDefaults(
  defineProps<{
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
  }>(),
  {
    value: 0,
    min: 0,
    max: 100,
    variant: 'line',
    status: 'normal',
    size: 48,
    thickness: 8,
    linecap: 'round',
    gapDegree: 75,
    gapPlacement: 'bottom',
    showValue: false,
  },
)
const attrs = useAttrs()
const normalized = computed(() => normalizeProgressValue(props.value, props.min, props.max))
const geometry = computed(() => getProgressGeometry(props))
const stops = computed(() => getProgressGradientStops(props.color))
const gradientId = `progress-${useId().replaceAll(':', '')}`
const display = computed(() =>
  normalized.value.percentage === null ? '' : `${Math.round(normalized.value.percentage * 100)}%`,
)
const rotation = computed(() => ({ bottom: 0, top: 180, start: 90, end: -90 })[props.gapPlacement])
const stroke = computed(() =>
  stops.value
    ? `url(#${gradientId})`
    : typeof props.color === 'string'
      ? props.color
      : props.status === 'success'
        ? 'var(--success)'
        : props.status === 'error'
          ? 'var(--danger)'
          : props.status === 'info'
            ? 'var(--info)'
            : props.status === 'warning'
              ? 'var(--warning)'
            : 'var(--primary)',
)
const trackStroke = computed(() => props.trackColor ?? 'var(--progress-remaining)')
const resolvedTrackLinecap = computed(() => props.trackLinecap ?? props.linecap)
const circlePercentage = computed(
  () => (geometry.value.percentage ?? 0.25) * geometry.value.arcRatio * 100,
)
const circleStartAngle = computed(() => geometry.value.rotation + rotation.value)
const circleEndAngle = computed(() => circleStartAngle.value + circlePercentage.value * 3.6)
const getCirclePoint = (angle: number) => {
  const radians = (angle * Math.PI) / 180
  return {
    left: `${geometry.value.center + geometry.value.radius * Math.sin(radians) - props.thickness / 2}px`,
    top: `${geometry.value.center - geometry.value.radius * Math.cos(radians) - props.thickness / 2}px`,
  }
}
const circleStartColor = computed(
  () => stops.value?.[0]?.[1] ?? (typeof props.color === 'string' ? props.color : stroke.value),
)
const circleEndColor = computed(
  () =>
    stops.value?.[stops.value.length - 1]?.[1] ??
    (typeof props.color === 'string' ? props.color : stroke.value),
)
const circleBackground = computed(() => {
  const percentage = circlePercentage.value
  const arc = geometry.value.arcRatio * 100
  const fill = stops.value
    ? stops.value
        .map(([offset, value]) => `${value} ${(Number.parseFloat(offset) / 100) * percentage}%`)
        .join(', ')
    : `${typeof props.color === 'string' ? props.color : stroke.value} 0 ${percentage}%`
  return `conic-gradient(from ${geometry.value.rotation + rotation.value}deg, ${fill}, ${trackStroke.value} ${percentage}% ${arc}%, transparent ${arc}% 100%)`
})
const linePercentage = computed(() => (normalized.value.percentage ?? 0.25) * 100)
const lineTrackRadius = computed(() => (resolvedTrackLinecap.value === 'round' ? '9999px' : '0px'))
const lineRangeRadius = computed(() => (props.linecap === 'round' ? '9999px' : '0px'))
const lineWidth = computed(() =>
  props.linecap === 'square'
    ? `min(100%, calc(${linePercentage.value}% + ${props.thickness / 2}px))`
    : `${linePercentage.value}%`,
)
</script>
<template>
  <div
    v-bind="attrs"
    role="progressbar"
    :aria-valuemin="normalized.min"
    :aria-valuemax="normalized.max"
    :aria-valuenow="normalized.value ?? undefined"
    :aria-valuetext="display || undefined"
    data-slot="progress"
    :data-variant="props.variant"
    :data-status="props.status"
    :data-state="geometry.state"
    :class="
      cn(
        progressRootClassName,
        props.variant === 'line' && 'w-full',
        attrs.class as string | undefined,
      )
    "
  >
    <template v-if="props.variant === 'line'"
      ><div
        data-slot="progress-track"
        :class="progressLineClassName"
        :style="{
          background: props.trackColor,
          height: `${props.thickness}px`,
          borderRadius: lineTrackRadius,
        }"
      >
        <div
          data-slot="progress-range"
          :data-state="geometry.state"
          :data-status="props.status"
          :class="progressLineRangeClassName"
          :style="{
            width: lineWidth,
            borderRadius: lineRangeRadius,
            background: getLinearProgressBackground(props.color),
          }"
        />
      </div>
      <span v-if="props.showValue" class="ms-2 shrink-0"
        ><slot name="value">{{ display }}</slot></span
      ></template
    ><template v-else
      ><svg
        aria-hidden="true"
        :class="progressCircleClassName"
        :width="props.size"
        :height="props.size"
        :viewBox="`0 0 ${props.size} ${props.size}`"
        :style="{ transform: `rotate(${rotation}deg)` }"
      >
        <defs>
          <linearGradient v-if="stops" :id="gradientId">
            <stop v-for="stop in stops" :key="stop[0]" :offset="stop[0]" :stop-color="stop[1]" />
          </linearGradient>
        </defs>
        <circle
          :class="progressCircleTrackClassName"
          :cx="geometry.center"
          :cy="geometry.center"
          :r="geometry.radius"
          fill="none"
          :stroke="trackStroke"
          :stroke-width="props.thickness"
          :stroke-linecap="resolvedTrackLinecap"
          pathLength="100"
          :stroke-dasharray="geometry.trackDasharray"
          :transform="`rotate(${geometry.rotation} ${geometry.center} ${geometry.center})`"
        />
        <circle
          :data-state="geometry.state"
          :data-status="props.status"
          :class="progressCircleRangeClassName"
          :cx="geometry.center"
          :cy="geometry.center"
          :r="geometry.radius"
          fill="none"
          :stroke="stroke"
          :stroke-width="props.thickness"
          :stroke-linecap="props.linecap"
          pathLength="100"
          :stroke-dasharray="geometry.rangeDasharray"
          :stroke-dashoffset="geometry.dashOffset"
          :transform="`rotate(${geometry.rotation} ${geometry.center} ${geometry.center})`"
        />
      </svg>
      <span
        v-if="geometry.percentage !== null"
        aria-hidden="true"
        class="pointer-events-none absolute rounded-full"
        :style="{
          width: `${props.size}px`,
          height: `${props.size}px`,
          background: circleBackground,
          mask: `radial-gradient(farthest-side, transparent calc(100% - ${props.thickness}px), #000 calc(100% - ${props.thickness}px))`,
          WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${props.thickness}px), #000 calc(100% - ${props.thickness}px))`,
        }"
      />
      <template
        v-if="geometry.percentage !== null && props.linecap === 'round' && circlePercentage > 0"
      >
        <span
          aria-hidden="true"
          class="pointer-events-none absolute rounded-full"
          :style="{
            ...getCirclePoint(circleStartAngle),
            width: `${props.thickness}px`,
            height: `${props.thickness}px`,
            background: circleStartColor,
          }"
        />
        <span
          aria-hidden="true"
          class="pointer-events-none absolute rounded-full"
          :style="{
            ...getCirclePoint(circleEndAngle),
            width: `${props.thickness}px`,
            height: `${props.thickness}px`,
            background: circleEndColor,
          }"
        />
      </template>
      <span v-if="props.showValue" :class="progressValueClassName"
        ><slot name="value">{{ display }}</slot></span
      ></template
    >
  </div>
</template>
