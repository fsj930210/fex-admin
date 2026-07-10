<script lang="ts">
  import { sliderTrackClassName } from '@fex/components-styles/slider'
  import { cn } from '@fex/utils'
  import { getContext, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { sliderContextKey, type SliderContext } from './context'

  interface SliderTrackProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
    children?: Snippet | undefined
  }

  let { class: className, children, ...rest }: SliderTrackProps = $props()
  const { snapshot } = getContext<SliderContext>(sliderContextKey)
  const currentSnapshot = $derived(snapshot())
</script>

<span {...rest} data-disabled={currentSnapshot.disabled ? 'true' : undefined} data-orientation={currentSnapshot.orientation} class={cn(sliderTrackClassName, className)}>
  {@render children?.()}
</span>
