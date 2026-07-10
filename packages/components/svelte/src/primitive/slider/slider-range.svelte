<script lang="ts">
  import { convertValueToPercentage } from '@fex/components-core/slider/utils'
  import { sliderRangeClassName } from '@fex/components-styles/slider'
  import { cn } from '@fex/utils'
  import { getContext } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { sliderContextKey, type SliderContext } from './context'

  interface SliderRangeProps extends HTMLAttributes<HTMLSpanElement> {}

  let { class: className, style, ...rest }: SliderRangeProps = $props()
  const { snapshot } = getContext<SliderContext>(sliderContextKey)
  const currentSnapshot = $derived(snapshot())
  const rangeStyle = $derived.by(() => {
    const percentages = currentSnapshot.values.map((value) => convertValueToPercentage(value, currentSnapshot.min, currentSnapshot.max))
    const start = currentSnapshot.values.length > 1 ? Math.min(...percentages) : 0
    const end = 100 - Math.max(...percentages)
    return currentSnapshot.orientation === 'vertical' ? `bottom: ${start}%; top: ${end}%; ${style ?? ''}` : `left: ${start}%; right: ${end}%; ${style ?? ''}`
  })
</script>

<span {...rest} data-disabled={currentSnapshot.disabled ? 'true' : undefined} data-orientation={currentSnapshot.orientation} class={cn(sliderRangeClassName, className)} style={rangeStyle}></span>
