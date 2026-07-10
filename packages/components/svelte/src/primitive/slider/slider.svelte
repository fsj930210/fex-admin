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
    get value() { return value },
    get defaultValue() { return defaultValue },
    get min() { return min },
    get max() { return max },
    get step() { return step },
    get minStepsBetweenThumbs() { return minStepsBetweenThumbs },
    get orientation() { return orientation },
    get disabled() { return disabled },
    onChange: (nextValue: number[]) => onValueChange?.(nextValue),
    onCommit: (nextValue: number[]) => onValueCommit?.(nextValue),
  }
  const controller = createSliderController(options)
  const storeSnapshot = readableCoreStore(controller)
  const snapshot = () => {
    $storeSnapshot
    return controller.getSnapshot()
  }
  const currentSnapshot = $derived(snapshot())

  setContext(sliderContextKey, { controller, snapshot } satisfies SliderContext)
</script>

<div
  {...rest}
  bind:this={rootElement}
  data-disabled={currentSnapshot.disabled ? 'true' : undefined}
  data-orientation={currentSnapshot.orientation}
  class={cn(sliderRootClassName({ size, orientation: currentSnapshot.orientation }), className)}
  onpointerdown={(event) => {
    onpointerdown?.(event)
    if (event.defaultPrevented || currentSnapshot.disabled || !rootElement) return
    rootElement.setPointerCapture(event.pointerId)
    controller.startSlide(getSliderValueFromPointer(event.clientX, event.clientY, rootElement.getBoundingClientRect(), currentSnapshot.min, currentSnapshot.max, currentSnapshot.orientation))
  }}
  onpointermove={(event) => {
    onpointermove?.(event)
    if (event.defaultPrevented || currentSnapshot.disabled || !rootElement?.hasPointerCapture(event.pointerId)) return
    controller.moveSlide(getSliderValueFromPointer(event.clientX, event.clientY, rootElement.getBoundingClientRect(), currentSnapshot.min, currentSnapshot.max, currentSnapshot.orientation))
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
