<script lang="ts">
  import { sliderTrackClassName } from '@fex/components-styles/slider'
  import { cn } from '@fex/utils'
  import { getContext, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { sliderContextKey, type SliderContext } from './context'

  interface SliderTrackProps extends HTMLAttributes<HTMLSpanElement> {
    children?: Snippet | undefined
  }

  let { class: className, children, ...rest }: SliderTrackProps = $props()
  const { snapshot } = getContext<SliderContext>(sliderContextKey)
</script>

<span {...rest} data-disabled={$snapshot.disabled ? 'true' : undefined} data-orientation={$snapshot.orientation} class={cn(sliderTrackClassName, className)}>
  {@render children?.()}
</span>
