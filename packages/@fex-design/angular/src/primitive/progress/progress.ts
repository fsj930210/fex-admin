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
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'
import { createHostClassName } from '../../signals/host-class'
let nextProgressId = 0
@Component({
  selector: 'fex-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './progress.html',
  host: {
    '[class]': 'hostClassName()',
    role: 'progressbar',
    'data-slot': 'progress',
    '[attr.data-variant]': 'variant()',
    '[attr.data-status]': 'status()',
    '[attr.data-state]': 'geometry().state',
    '[attr.aria-valuemin]': 'normalized().min',
    '[attr.aria-valuemax]': 'normalized().max',
    '[attr.aria-valuenow]': 'normalized().value',
  },
})
export class Progress {
  readonly value = input<number | null>(0)
  readonly min = input(0)
  readonly max = input(100)
  readonly variant = input<ProgressVariant>('line')
  readonly status = input<ProgressStatus>('normal')
  readonly size = input(48)
  readonly thickness = input(8)
  readonly linecap = input<ProgressLinecap>('round')
  readonly trackLinecap = input<ProgressLinecap>()
  readonly color = input<ProgressColor>()
  readonly trackColor = input<string>()
  readonly gapDegree = input(75)
  readonly gapPlacement = input<'top' | 'bottom' | 'start' | 'end'>('bottom')
  readonly showValue = input(false, { transform: booleanAttribute })
  protected readonly normalized = computed(() =>
    normalizeProgressValue(this.value(), this.min(), this.max()),
  )
  protected readonly geometry = computed(() =>
    getProgressGeometry({
      value: this.value(),
      min: this.min(),
      max: this.max(),
      size: this.size(),
      thickness: this.thickness(),
      variant: this.variant(),
      gapDegree: this.gapDegree(),
    }),
  )
  protected readonly stops = computed(() => getProgressGradientStops(this.color()))
  protected readonly gradientId = `progress-${nextProgressId++}`
  protected readonly display = computed(() =>
    this.normalized().percentage === null
      ? ''
      : `${Math.round(this.normalized().percentage! * 100)}%`,
  )
  protected readonly rotation = computed(
    () => ({ bottom: 0, top: 180, start: 90, end: -90 })[this.gapPlacement()],
  )
  protected readonly stroke = computed(() =>
    this.stops()
      ? `url(#${this.gradientId})`
      : typeof this.color() === 'string'
        ? (this.color() as string)
        : this.status() === 'success'
          ? 'var(--success)'
          : this.status() === 'error'
            ? 'var(--danger)'
            : this.status() === 'info'
              ? 'var(--info)'
              : this.status() === 'warning'
                ? 'var(--warning)'
              : 'var(--primary)',
  )
  protected readonly trackStroke = computed(() => this.trackColor() ?? 'var(--progress-remaining)')
  protected readonly resolvedTrackLinecap = computed(() => this.trackLinecap() ?? this.linecap())
  protected readonly circlePercentage = computed(
    () => (this.geometry().percentage ?? 0.25) * this.geometry().arcRatio * 100,
  )
  protected readonly circleStartAngle = computed(() => this.geometry().rotation + this.rotation())
  protected readonly circleEndAngle = computed(
    () => this.circleStartAngle() + this.circlePercentage() * 3.6,
  )
  protected circlePoint(angle: number) {
    const radians = (angle * Math.PI) / 180
    return {
      left:
        this.geometry().center + this.geometry().radius * Math.sin(radians) - this.thickness() / 2,
      top:
        this.geometry().center - this.geometry().radius * Math.cos(radians) - this.thickness() / 2,
    }
  }
  protected readonly circleStartColor = computed(
    () =>
      this.stops()?.[0]?.[1] ??
      (typeof this.color() === 'string' ? (this.color() as string) : this.stroke()),
  )
  protected readonly circleEndColor = computed(
    () =>
      this.stops()?.[this.stops()!.length - 1]?.[1] ??
      (typeof this.color() === 'string' ? (this.color() as string) : this.stroke()),
  )
  protected readonly circleBackground = computed(() => {
    const color = this.color()
    const geometry = this.geometry()
    const percentage = this.circlePercentage()
    const arc = geometry.arcRatio * 100
    const fill = this.stops()
      ? this.stops()!
          .map(([offset, value]) => `${value} ${(Number.parseFloat(offset) / 100) * percentage}%`)
          .join(', ')
      : `${typeof color === 'string' ? color : this.stroke()} 0 ${percentage}%`
    return `conic-gradient(from ${geometry.rotation + this.rotation()}deg, ${fill}, ${this.trackStroke()} ${percentage}% ${arc}%, transparent ${arc}% 100%)`
  })
  protected readonly linePercentage = computed(() => (this.normalized().percentage ?? 0.25) * 100)
  protected readonly lineTrackRadius = computed(() =>
    this.resolvedTrackLinecap() === 'round' ? '9999px' : '0px',
  )
  protected readonly lineRangeRadius = computed(() =>
    this.linecap() === 'round' ? '9999px' : '0px',
  )
  protected readonly lineWidth = computed(() =>
    this.linecap() === 'square'
      ? `min(100%, calc(${this.linePercentage()}% + ${this.thickness() / 2}px))`
      : `${this.linePercentage()}%`,
  )
  protected readonly lineBackground = computed(() => getLinearProgressBackground(this.color()))
  protected readonly hostClassName = createHostClassName(
    () => `${progressRootClassName} ${this.variant() === 'line' ? 'w-full' : ''}`,
  )
  protected readonly lineClass = progressLineClassName
  protected readonly lineRangeClass = progressLineRangeClassName
  protected readonly circleClass = progressCircleClassName
  protected readonly circleTrackClass = progressCircleTrackClassName
  protected readonly circleRangeClass = progressCircleRangeClassName
  protected readonly valueClass = progressValueClassName
}
