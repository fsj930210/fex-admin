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
  const value = $derived($snapshot.values[index] ?? $snapshot.min)
  const percent = $derived(convertValueToPercentage(value, $snapshot.min, $snapshot.max))
  const thumbStyle = $derived(
    $snapshot.orientation === 'vertical'
      ? `position: absolute; bottom: ${percent}%; left: 50%; transform: translate(-50%, 50%); ${style ?? ''}`
      : `position: absolute; top: 50%; left: ${percent}%; transform: translate(-50%, -50%); ${style ?? ''}`,
  )

  function handleKeydown(event: KeyboardEvent) {
    onkeydown?.(event)
    if (event.defaultPrevented || $snapshot.disabled) return
    const keyMap: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 10, PageDown: -10 }
    if (event.key === 'Home') {
      event.preventDefault()
      controller.setValueAt(index, $snapshot.min, { commit: true })
    } else if (event.key === 'End') {
      event.preventDefault()
      controller.setValueAt(index, $snapshot.max, { commit: true })
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
  tabindex={$snapshot.disabled ? undefined : 0}
  aria-valuemin={$snapshot.min}
  aria-valuemax={$snapshot.max}
  aria-valuenow={value}
  aria-disabled={$snapshot.disabled || undefined}
  data-disabled={$snapshot.disabled ? 'true' : undefined}
  data-orientation={$snapshot.orientation}
  class={cn(sliderThumbClassName, className)}
  style={thumbStyle}
  onfocus={(event) => {
    onfocus?.(event)
    controller.setActiveIndex(index)
  }}
  onkeydown={handleKeydown}
></span>
