<script lang="ts">
  import { getContext } from 'svelte'
  import { tourContextKey, type TourContext } from '@fex-design/svelte/primitive/tour-context'
  let { count }: { count: number } = $props()
  const { controller, snapshot } = getContext<TourContext>(tourContextKey)
</script>
<div class="flex items-center gap-1" aria-label="引导进度">{#each Array(count) as _, index}<button type="button" aria-label={`第 ${index + 1} 步`} aria-current={index === $snapshot.currentIndex ? 'step' : undefined} class={index === $snapshot.currentIndex ? 'h-1.5 w-5 rounded-full bg-primary' : 'h-1.5 w-1.5 rounded-full bg-muted-foreground/40'} onclick={() => void controller.goTo(index)}></button>{/each}</div>
