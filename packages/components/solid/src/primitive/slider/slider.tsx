import { createSliderController } from '@fex/components-core/slider/create-slider-controller'
import type { SliderOrientation } from '@fex/components-core/slider/types'
import { convertValueToPercentage, getSliderValueFromPointer } from '@fex/components-core/slider/utils'
import {
  sliderRangeClassName,
  sliderRootClassName,
  sliderThumbClassName,
  sliderTrackClassName,
  type SliderStyleProps,
} from '@fex/components-styles/slider'
import { cn } from '@fex/utils'
import { splitProps, type JSX } from 'solid-js'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'

import { SliderContext, useSliderContext } from './slider-context'

export interface SliderRootProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'>,
    SliderStyleProps {
  value?: number[]
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
  minStepsBetweenThumbs?: number
  orientation?: SliderOrientation
  disabled?: boolean
  onValueChange?: (value: number[]) => void
  onValueCommit?: (value: number[]) => void
}

export function SliderRoot(props: SliderRootProps) {
  const [local, rest] = splitProps(props, [
    'value',
    'defaultValue',
    'min',
    'max',
    'step',
    'minStepsBetweenThumbs',
    'orientation',
    'disabled',
    'size',
    'class',
    'children',
    'onPointerDown',
    'onPointerMove',
    'onPointerUp',
    'onValueChange',
    'onValueCommit',
  ])
  let rootElement: HTMLDivElement | undefined
  const options = {
    get value() { return local.value },
    get defaultValue() { return local.defaultValue },
    get min() { return local.min },
    get max() { return local.max },
    get step() { return local.step },
    get minStepsBetweenThumbs() { return local.minStepsBetweenThumbs },
    get orientation() { return local.orientation },
    get disabled() { return local.disabled },
    onChange: (value: number[]) => local.onValueChange?.(value),
    onCommit: (value: number[]) => local.onValueCommit?.(value),
  }
  const controller = createSliderController(options)
  const storeSnapshot = createCoreStoreSignal(controller)
  const snapshot = () => {
    storeSnapshot()
    return controller.getSnapshot()
  }
  const size = () => local.size ?? 'default'

  return (
    <SliderContext.Provider value={{ controller, snapshot, rootElement: () => rootElement }}>
      <div
        {...rest}
        ref={(element) => {
          rootElement = element
        }}
        data-disabled={snapshot().disabled ? 'true' : undefined}
        data-orientation={snapshot().orientation}
        class={cn(sliderRootClassName({ size: size(), orientation: snapshot().orientation }), local.class)}
        onPointerDown={(event) => {
          if (typeof local.onPointerDown === 'function') local.onPointerDown(event)
          if (event.defaultPrevented || snapshot().disabled || !rootElement) return
          rootElement.setPointerCapture(event.pointerId)
          controller.startSlide(getSliderValueFromPointer(event.clientX, event.clientY, rootElement.getBoundingClientRect(), snapshot().min, snapshot().max, snapshot().orientation))
        }}
        onPointerMove={(event) => {
          if (typeof local.onPointerMove === 'function') local.onPointerMove(event)
          if (event.defaultPrevented || snapshot().disabled || !rootElement?.hasPointerCapture(event.pointerId)) return
          controller.moveSlide(getSliderValueFromPointer(event.clientX, event.clientY, rootElement.getBoundingClientRect(), snapshot().min, snapshot().max, snapshot().orientation))
        }}
        onPointerUp={(event) => {
          if (typeof local.onPointerUp === 'function') local.onPointerUp(event)
          if (!rootElement?.hasPointerCapture(event.pointerId)) return
          rootElement.releasePointerCapture(event.pointerId)
          controller.endSlide()
        }}
      >
        {local.children}
      </div>
    </SliderContext.Provider>
  )
}

export interface SliderTrackProps extends JSX.HTMLAttributes<HTMLSpanElement> {}

export function SliderTrack(props: SliderTrackProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const { snapshot } = useSliderContext('SliderTrack')
  return <span {...rest} data-disabled={snapshot().disabled ? 'true' : undefined} data-orientation={snapshot().orientation} class={cn(sliderTrackClassName, local.class)}>{local.children}</span>
}

export interface SliderRangeProps extends JSX.HTMLAttributes<HTMLSpanElement> {}

export function SliderRange(props: SliderRangeProps) {
  const [local, rest] = splitProps(props, ['class', 'style'])
  const { snapshot } = useSliderContext('SliderRange')
  const rangeStyle = () => {
    const percentages = snapshot().values.map((value) => convertValueToPercentage(value, snapshot().min, snapshot().max))
    const start = snapshot().values.length > 1 ? Math.min(...percentages) : 0
    const end = 100 - Math.max(...percentages)
    return snapshot().orientation === 'vertical'
      ? { bottom: `${start}%`, top: `${end}%`, ...(typeof local.style === 'object' ? local.style : {}) }
      : { left: `${start}%`, right: `${end}%`, ...(typeof local.style === 'object' ? local.style : {}) }
  }
  return <span {...rest} data-disabled={snapshot().disabled ? 'true' : undefined} data-orientation={snapshot().orientation} class={cn(sliderRangeClassName, local.class)} style={rangeStyle()} />
}

export interface SliderThumbProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  index?: number
}

export function SliderThumb(props: SliderThumbProps) {
  const [local, rest] = splitProps(props, ['index', 'class', 'style', 'onFocus', 'onKeyDown'])
  const context = useSliderContext('SliderThumb')
  const index = () => local.index ?? 0
  const value = () => context.snapshot().values[index()] ?? context.snapshot().min
  const percent = () => convertValueToPercentage(value(), context.snapshot().min, context.snapshot().max)
  const customStyle = () => typeof local.style === 'object' ? local.style as JSX.CSSProperties : {}
  const thumbStyle = (): JSX.CSSProperties =>
    context.snapshot().orientation === 'vertical'
      ? { position: 'absolute', bottom: `${percent()}%`, left: '50%', transform: 'translate(-50%, 50%)', ...customStyle() }
      : { position: 'absolute', top: '50%', left: `${percent()}%`, transform: 'translate(-50%, -50%)', ...customStyle() }

  return (
    <span
      {...rest}
      role="slider"
      tabIndex={context.snapshot().disabled ? undefined : 0}
      aria-valuemin={context.snapshot().min}
      aria-valuemax={context.snapshot().max}
      aria-valuenow={value()}
      aria-disabled={context.snapshot().disabled || undefined}
      data-disabled={context.snapshot().disabled ? 'true' : undefined}
      data-orientation={context.snapshot().orientation}
      class={cn(sliderThumbClassName, local.class)}
      style={thumbStyle()}
      onFocus={(event) => {
        if (typeof local.onFocus === 'function') local.onFocus(event)
        context.controller.setActiveIndex(index())
      }}
      onKeyDown={(event) => {
        if (typeof local.onKeyDown === 'function') local.onKeyDown(event)
        if (event.defaultPrevented || context.snapshot().disabled) return
        const keyMap: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 10, PageDown: -10 }
        if (event.key === 'Home') {
          event.preventDefault()
          context.controller.setValueAt(index(), context.snapshot().min, { commit: true })
        } else if (event.key === 'End') {
          event.preventDefault()
          context.controller.setValueAt(index(), context.snapshot().max, { commit: true })
        } else if (event.key in keyMap) {
          event.preventDefault()
          const direction = keyMap[event.key]!
          context.controller.stepThumb(index(), direction > 0 ? 1 : -1, Math.abs(direction))
        }
      }}
    />
  )
}
