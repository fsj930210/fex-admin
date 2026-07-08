<script lang="ts">
  import { createSliderController } from '@fex/components-core/slider/create-slider-controller'
  import type { SliderController, SliderOrientation, SliderSnapshot } from '@fex/components-core/slider/types'
  import { getSliderValueFromPointer } from '@fex/components-core/slider/utils'
  import { sliderRootClassName, type SliderStyleProps } from '@fex/components-styles/slider'
  import { cn } from '@fex/utils'
  import { setContext, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { readableCoreStore } from '../../stores/core-store'
  import { sliderContextKey, type SliderContext } from './context'

  interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'children' | 'onchange'>, SliderStyleProps {
    value?: number[] | undefined
    defaultValue?: number[] | undefined
    min?: number | undefined
    max?: number | undefined
    step?: number | undefined
    minStepsBetweenThumbs?: number | undefined
    orientation?: SliderOrientation | undefined
    disabled?: boolean | undefined
    children?: Snippet | undefined
    onValueChange?: ((value: number[]) => void) | undefined
    onValueCommit?: ((value: number[]) => void) | undefined
  }

  let {
    value,
    defaultValue,
    min = 0,
    max = 100,
    step = 1,
    minStepsBetweenThumbs = 0,
    orientation = 'horizontal',
    disabled = false,
    size = 'default',
    class: className,
    children,
    onpointerdown,
    onpointermove,
    onpointerup,
    onValueChange,
    onValueCommit,
    ...rest
  }: SliderProps = $props()

  let rootElement: HTMLDivElement | undefined
  const options = {
    value,
    defaultValue,
    min,
    max,
    step,
    minStepsBetweenThumbs,
    orientation,
    disabled,
    onChange: (nextValue: number[]) => onValueChange?.(nextValue),
    onCommit: (nextValue: number[]) => onValueCommit?.(nextValue),
  }
  const controller = createSliderController(options)
  const snapshot = readableCoreStore(controller)

  $effect(() => {
    Object.assign(options, { value, defaultValue, min, max, step, minStepsBetweenThumbs, orientation, disabled })
    controller.syncSnapshot()
  })

  setContext(sliderContextKey, { controller, snapshot } satisfies SliderContext)
</script>

<div
  {...rest}
  bind:this={rootElement}
  data-disabled={$snapshot.disabled ? 'true' : undefined}
  data-orientation={$snapshot.orientation}
  class={cn(sliderRootClassName({ size, orientation: $snapshot.orientation }), className)}
  onpointerdown={(event) => {
    onpointerdown?.(event)
    if (event.defaultPrevented || $snapshot.disabled || !rootElement) return
    rootElement.setPointerCapture(event.pointerId)
    controller.startSlide(getSliderValueFromPointer(event.clientX, event.clientY, rootElement.getBoundingClientRect(), $snapshot.min, $snapshot.max, $snapshot.orientation))
  }}
  onpointermove={(event) => {
    onpointermove?.(event)
    if (event.defaultPrevented || $snapshot.disabled || !rootElement?.hasPointerCapture(event.pointerId)) return
    controller.moveSlide(getSliderValueFromPointer(event.clientX, event.clientY, rootElement.getBoundingClientRect(), $snapshot.min, $snapshot.max, $snapshot.orientation))
  }}
  onpointerup={(event) => {
    onpointerup?.(event)
    if (!rootElement?.hasPointerCapture(event.pointerId)) return
    rootElement.releasePointerCapture(event.pointerId)
    controller.endSlide()
  }}
>
  {@render children?.()}
</div>
