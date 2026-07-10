import { createSliderController } from '@fex/components-core/slider/create-slider-controller'
import type { SliderOptions, SliderOrientation } from '@fex/components-core/slider/types'
import { convertValueToPercentage, getSliderValueFromPointer } from '@fex/components-core/slider/utils'
import {
  sliderRangeClassName,
  sliderRootClassName,
  sliderThumbClassName,
  sliderTrackClassName,
  type SliderStyleProps,
} from '@fex/components-styles/slider'
import { cn } from '@fex/utils'
import {
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
  type MutableRefObject,
} from 'react'
import { useCoreStore } from '../../hooks/use-core-store'
import { useLazyRef } from '../../hooks/use-lazy-ref'

export interface SliderRootProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'>, SliderStyleProps {
  value?: number[] | undefined
  defaultValue?: number[] | undefined
  min?: number
  max?: number
  step?: number
  minStepsBetweenThumbs?: number
  orientation?: SliderOrientation
  disabled?: boolean
  ref?: Ref<HTMLDivElement>
  onValueChange?: (value: number[]) => void
  onValueCommit?: (value: number[]) => void
}

import { SliderContext, useSliderContext, type SliderContextValue } from './slider-context'

function composeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as MutableRefObject<T>).current = node
    }
  }
}

export function SliderRoot({
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  minStepsBetweenThumbs = 0,
  orientation = 'horizontal',
  disabled = false,
  size = 'default',
  className,
  ref,
  children,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onValueChange,
  onValueCommit,
  ...props
}: SliderRootProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const optionsRef = useRef<SliderOptions>({
    ...(value === undefined ? {} : { value }),
    ...(defaultValue === undefined ? {} : { defaultValue }),
    min,
    max,
    step,
    minStepsBetweenThumbs,
    orientation,
    disabled,
    onChange: (nextValue) => onValueChange?.(nextValue),
    onCommit: (nextValue) => onValueCommit?.(nextValue),
  })
  Object.assign(optionsRef.current, {
    value,
    defaultValue,
    min,
    max,
    step,
    minStepsBetweenThumbs,
    orientation,
    disabled,
    onChange: onValueChange,
    onCommit: onValueCommit,
  })
  const controllerRef = useLazyRef(() => createSliderController(optionsRef.current))
  const snapshot = useCoreStore(controllerRef.current)

  return (
    <SliderContext value={{ controller: controllerRef.current, snapshot, rootRef }}>
      <div
        {...props}
        ref={composeRefs(rootRef, ref)}
        data-disabled={snapshot.disabled ? 'true' : undefined}
        data-orientation={snapshot.orientation}
        className={cn(sliderRootClassName({ size, orientation: snapshot.orientation }), className)}
        onPointerDown={(event) => {
          onPointerDown?.(event)
          if (event.defaultPrevented || snapshot.disabled || !rootRef.current) return
          rootRef.current.setPointerCapture(event.pointerId)
          const rect = rootRef.current.getBoundingClientRect()
          controllerRef.current.startSlide(getSliderValueFromPointer(event.clientX, event.clientY, rect, snapshot.min, snapshot.max, snapshot.orientation))
        }}
        onPointerMove={(event) => {
          onPointerMove?.(event)
          if (event.defaultPrevented || snapshot.disabled || !rootRef.current?.hasPointerCapture(event.pointerId)) return
          const rect = rootRef.current.getBoundingClientRect()
          controllerRef.current.moveSlide(getSliderValueFromPointer(event.clientX, event.clientY, rect, snapshot.min, snapshot.max, snapshot.orientation))
        }}
        onPointerUp={(event) => {
          onPointerUp?.(event)
          if (rootRef.current?.hasPointerCapture(event.pointerId)) {
            rootRef.current.releasePointerCapture(event.pointerId)
            controllerRef.current.endSlide()
          }
        }}
      >
        {children}
      </div>
    </SliderContext>
  )
}

export interface SliderTrackProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>
}

export function SliderTrack({ ref, className, ...props }: SliderTrackProps) {
  const { snapshot } = useSliderContext('SliderTrack')

  return <span {...props} ref={ref} data-disabled={snapshot.disabled ? 'true' : undefined} data-orientation={snapshot.orientation} className={cn(sliderTrackClassName, className)} />
}

export interface SliderRangeProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>
}

export function SliderRange({ ref, className, style, ...props }: SliderRangeProps) {
  const { snapshot } = useSliderContext('SliderRange')
  const percentages = snapshot.values.map((value) => convertValueToPercentage(value, snapshot.min, snapshot.max))
  const start = snapshot.values.length > 1 ? Math.min(...percentages) : 0
  const end = 100 - Math.max(...percentages)

  return (
    <span
      {...props}
      ref={ref}
      data-disabled={snapshot.disabled ? 'true' : undefined}
      data-orientation={snapshot.orientation}
      className={cn(sliderRangeClassName, className)}
      style={snapshot.orientation === 'vertical' ? { bottom: `${start}%`, top: `${end}%`, ...style } : { left: `${start}%`, right: `${end}%`, ...style }}
    />
  )
}

export interface SliderThumbProps extends HTMLAttributes<HTMLSpanElement> {
  index?: number
  ref?: Ref<HTMLSpanElement>
}

function handleThumbKeyDown(event: KeyboardEvent<HTMLSpanElement>, index: number, context: SliderContextValue) {
  const { controller, snapshot } = context
  const isRtl = false
  const directionMap: Record<string, number> = {
    ArrowRight: isRtl ? -1 : 1,
    ArrowUp: 1,
    ArrowLeft: isRtl ? 1 : -1,
    ArrowDown: -1,
    PageUp: 10,
    PageDown: -10,
  }

  if (event.key === 'Home') {
    event.preventDefault()
    controller.setValueAt(index, snapshot.min, { commit: true })
    return
  }
  if (event.key === 'End') {
    event.preventDefault()
    controller.setValueAt(index, snapshot.max, { commit: true })
    return
  }
  if (event.key in directionMap) {
    event.preventDefault()
    const direction = directionMap[event.key]!
    controller.stepThumb(index, direction > 0 ? 1 : -1, Math.abs(direction))
  }
}

export function SliderThumb({ index = 0, ref, className, style, onFocus, onKeyDown, ...props }: SliderThumbProps) {
  const context = useSliderContext('SliderThumb')
  const { controller, snapshot } = context
  const value = snapshot.values[index] ?? snapshot.min
  const percent = convertValueToPercentage(value, snapshot.min, snapshot.max)
  const positionStyle =
    snapshot.orientation === 'vertical'
      ? { position: 'absolute' as const, bottom: `${percent}%`, left: '50%', transform: 'translate(-50%, 50%)' }
      : { position: 'absolute' as const, top: '50%', left: `${percent}%`, transform: 'translate(-50%, -50%)' }

  return (
    <span
      {...props}
      ref={ref}
      role="slider"
      tabIndex={snapshot.disabled ? undefined : 0}
      aria-valuemin={snapshot.min}
      aria-valuemax={snapshot.max}
      aria-valuenow={value}
      aria-disabled={snapshot.disabled || undefined}
      data-disabled={snapshot.disabled ? 'true' : undefined}
      data-orientation={snapshot.orientation}
      className={cn(sliderThumbClassName, className)}
      style={{ ...positionStyle, ...style }}
      onFocus={(event) => {
        onFocus?.(event)
        controller.setActiveIndex(index)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented || snapshot.disabled) return
        handleThumbKeyDown(event, index, context)
      }}
    />
  )
}
