<script lang="ts">
  import { convertValueToPercentage } from '@fex/components-core/slider/utils'
  import { sliderThumbClassName } from '@fex/components-styles/slider'
  import { cn } from '@fex/utils'
  import { getContext } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { sliderContextKey, type SliderContext } from './context'

  interface SliderThumbProps extends HTMLAttributes<HTMLSpanElement> {
    index?: number | undefined
  }

  let { index = 0, class: className, style, onfocus, onkeydown, ...rest }: SliderThumbProps = $props()
  const { controller, snapshot } = getContext<SliderContext>(sliderContextKey)
  const currentSnapshot = $derived(snapshot())
  const value = $derived(currentSnapshot.values[index] ?? currentSnapshot.min)
  const percent = $derived(convertValueToPercentage(value, currentSnapshot.min, currentSnapshot.max))
  const thumbStyle = $derived(
    currentSnapshot.orientation === 'vertical'
      ? `position: absolute; bottom: ${percent}%; left: 50%; transform: translate(-50%, 50%); ${style ?? ''}`
      : `position: absolute; top: 50%; left: ${percent}%; transform: translate(-50%, -50%); ${style ?? ''}`,
  )

  function handleKeydown(event: Parameters<NonNullable<SliderThumbProps['onkeydown']>>[0]) {
    onkeydown?.(event)
    if (event.defaultPrevented || currentSnapshot.disabled) return
    const keyMap: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 10, PageDown: -10 }
    if (event.key === 'Home') {
      event.preventDefault()
      controller.setValueAt(index, currentSnapshot.min, { commit: true })
    } else if (event.key === 'End') {
      event.preventDefault()
      controller.setValueAt(index, currentSnapshot.max, { commit: true })
    } else if (event.key in keyMap) {
      event.preventDefault()
      const direction = keyMap[event.key]!
      controller.stepThumb(index, direction > 0 ? 1 : -1, Math.abs(direction))
    }
  }
</script>

<span
  {...rest}
  role="slider"
  tabindex={currentSnapshot.disabled ? undefined : 0}
  aria-valuemin={currentSnapshot.min}
  aria-valuemax={currentSnapshot.max}
  aria-valuenow={value}
  aria-disabled={currentSnapshot.disabled || undefined}
  data-disabled={currentSnapshot.disabled ? 'true' : undefined}
  data-orientation={currentSnapshot.orientation}
  class={cn(sliderThumbClassName, className)}
  style={thumbStyle}
  onfocus={(event) => {
    onfocus?.(event)
    controller.setActiveIndex(index)
  }}
  onkeydown={handleKeydown}
></span>
