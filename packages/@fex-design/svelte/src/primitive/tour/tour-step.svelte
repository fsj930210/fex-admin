<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { TourStepOptions } from '@fex-design/core/tour/types'
  import { getContext, onDestroy } from 'svelte'
  import { tourContextKey, type TourContext } from './tour-context'
  let { children, ...step }: TourStepOptions & { children?: Snippet } = $props()
  const { controller, snapshot } = getContext<TourContext>(tourContextKey)
  const unregister = controller.registerStep(step)
  onDestroy(unregister)
</script>
{#if $snapshot.currentStep?.name === step.name}{@render children?.()}{/if}
