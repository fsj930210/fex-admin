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
  const rangeStyle = $derived.by(() => {
    const percentages = $snapshot.values.map((value) => convertValueToPercentage(value, $snapshot.min, $snapshot.max))
    const start = $snapshot.values.length > 1 ? Math.min(...percentages) : 0
    const end = 100 - Math.max(...percentages)
    return $snapshot.orientation === 'vertical' ? `bottom: ${start}%; top: ${end}%; ${style ?? ''}` : `left: ${start}%; right: ${end}%; ${style ?? ''}`
  })
</script>

<span {...rest} data-disabled={$snapshot.disabled ? 'true' : undefined} data-orientation={$snapshot.orientation} class={cn(sliderRangeClassName, className)} style={rangeStyle}></span>
