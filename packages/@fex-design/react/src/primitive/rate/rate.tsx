import type { RateDirection } from '@fex-design/core/rate/types'
import { getRateItemFill } from '@fex-design/core/rate/utils'
import {
  rateEmptyContentClassName,
  rateFilledContentClassName,
  rateItemClassName,
  rateRootClassName,
  type RateStyleProps,
} from '@fex-design/styles/rate'
import { cn } from '@fex/utils'
import { useRef, type HTMLAttributes, type PointerEvent, type ReactNode, type Ref } from 'react'
import { useComposedRef } from '../../hooks/use-composed-ref'
import { StarIcon } from '../../icon/star'
import { getRatePointerValue, handleRateKeyDown } from './rate-interactions'
import { useRate } from './use-rate'

export interface RateItemRenderState {
  index: number
  layer: 'empty' | 'filled'
  fill: number
  fillPercent: number
  full: boolean
  partial: boolean
  empty: boolean
  previewing: boolean
  disabled: boolean
  readOnly: boolean
}

export interface RateProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'dir' | 'onChange'>,
    RateStyleProps {
  value?: number
  defaultValue?: number
  count?: number
  step?: number
  disabled?: boolean
  readOnly?: boolean
  allowClear?: boolean
  direction?: RateDirection
  getValueText?: (value: number, count: number) => string
  children?: (state: RateItemRenderState) => ReactNode
  ref?: Ref<HTMLDivElement>
  onValuePreviewChange?: (value: number | null) => void
  onValueChange?: (value: number) => void
  onValueCommit?: (value: number) => void
}

function DefaultContent() {
  return <StarIcon aria-hidden="true" />
}

export function Rate({
  value,
  defaultValue,
  count = 5,
  step = 1,
  disabled = false,
  readOnly = false,
  allowClear = true,
  direction = 'ltr',
  size = 'default',
  getValueText = (currentValue, maximum) => `${currentValue} out of ${maximum}`,
  children = DefaultContent,
  className,
  ref,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onPointerLeave,
  onPointerOut,
  onKeyDown,
  onValuePreviewChange,
  onValueChange,
  onValueCommit,
  ...props
}: RateProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const composedRef = useComposedRef(rootRef, ref)
  const { controller, snapshot } = useRate({
    ...(value === undefined ? {} : { value }),
    ...(defaultValue === undefined ? {} : { defaultValue }),
    count,
    step,
    disabled,
    readOnly,
    allowClear,
    direction,
    ...(onValuePreviewChange === undefined ? {} : { onPreviewChange: onValuePreviewChange }),
    onChange: (nextValue) => onValueChange?.(nextValue),
    onCommit: (nextValue) => onValueCommit?.(nextValue),
  })

  function readPointerValue(event: PointerEvent<HTMLDivElement>) {
    return getRatePointerValue(
      event.currentTarget,
      event.clientX,
      snapshot.step,
      snapshot.count,
      snapshot.direction,
    )
  }

  return (
    <div
      {...props}
      ref={composedRef}
      role="slider"
      tabIndex={snapshot.disabled ? undefined : 0}
      dir={snapshot.direction}
      aria-valuemin={0}
      aria-valuemax={snapshot.count}
      aria-valuenow={snapshot.value}
      aria-valuetext={getValueText(snapshot.value, snapshot.count)}
      aria-disabled={snapshot.disabled || undefined}
      aria-readonly={snapshot.readOnly || undefined}
      data-disabled={snapshot.disabled ? 'true' : undefined}
      data-readonly={String(snapshot.readOnly)}
      className={cn(rateRootClassName({ size }), className)}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        if (event.defaultPrevented || snapshot.disabled || snapshot.readOnly) return
        event.currentTarget.setPointerCapture(event.pointerId)
        controller.startInteraction(readPointerValue(event))
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event)
        if (event.defaultPrevented || snapshot.disabled || snapshot.readOnly) return
        const nextValue = readPointerValue(event)
        if (snapshot.interacting) controller.moveInteraction(nextValue)
        else controller.preview(nextValue)
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event)
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId)
        }
        controller.commitInteraction()
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event)
        controller.cancelInteraction()
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)
        controller.clearPreview()
      }}
      onPointerOut={(event) => {
        onPointerOut?.(event)
        if (
          event.relatedTarget instanceof Node &&
          event.currentTarget.contains(event.relatedTarget)
        )
          return
        controller.clearPreview()
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented || snapshot.disabled || snapshot.readOnly) return
        handleRateKeyDown(
          event,
          snapshot.direction,
          controller.stepValue,
          (nextValue) => controller.setValue(nextValue, { commit: true }),
          snapshot.count,
        )
      }}
    >
      {Array.from({ length: snapshot.count }, (_, index) => {
        const fill = getRateItemFill(snapshot.displayValue, index)
        const commonState = {
          index,
          fill,
          fillPercent: fill * 100,
          full: fill === 1,
          partial: fill > 0 && fill < 1,
          empty: fill === 0,
          previewing: snapshot.previewValue !== null,
          disabled: snapshot.disabled,
          readOnly: snapshot.readOnly,
        }
        const hiddenPercent = (1 - fill) * 100
        const clipPath =
          snapshot.direction === 'rtl'
            ? `inset(0 0 0 ${hiddenPercent}%)`
            : `inset(0 ${hiddenPercent}% 0 0)`

        return (
          <span key={index} data-rate-item={index} className={rateItemClassName}>
            <span className={rateEmptyContentClassName}>
              {children({ ...commonState, layer: 'empty' })}
            </span>
            <span className={rateFilledContentClassName} style={{ clipPath }}>
              {children({ ...commonState, layer: 'filled' })}
            </span>
          </span>
        )
      })}
    </div>
  )
}

export { useRate } from './use-rate'
export type { RateChangeMeta, RateDirection, RateSnapshot } from '@fex-design/core/rate/types'
