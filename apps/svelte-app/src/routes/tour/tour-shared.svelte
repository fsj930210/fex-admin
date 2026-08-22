<script lang="ts">
  import CloseIcon from '@fex-design/svelte/icon/close'
  import TourControl from '@fex-design/svelte/primitive/tour-control'
  import { getContext } from 'svelte'
  import { tourContextKey, type TourContext } from '@fex-design/svelte/primitive/tour-context'
  import type { Snippet } from 'svelte'
  let { title, description, children }: { title: string; description: string; children?: Snippet } = $props()
  const { snapshot } = getContext<TourContext>(tourContextKey)
  const progress = $derived($snapshot.total > 0 ? (($snapshot.currentIndex + 1) / $snapshot.total) * 100 : 0)
</script>
<div class="relative w-72 space-y-3"><TourControl action="close" aria-label="关闭" class="absolute right-0 top-0 z-10 size-7 p-0"><CloseIcon class="size-4" /></TourControl><div class="space-y-1 pr-8"><h3 class="text-sm font-semibold">{title}</h3><p class="text-sm leading-5 text-muted-foreground">{description}</p></div><div class="flex items-center gap-2"><span class="shrink-0 text-xs tabular-nums text-muted-foreground">{$snapshot.currentIndex + 1} / {$snapshot.total}</span><div class="h-1.5 min-w-0 flex-1 overflow-hidden rounded-sm bg-muted-background" role="progressbar" aria-label="引导进度" aria-valuemin="0" aria-valuemax={$snapshot.total} aria-valuenow={$snapshot.currentIndex + 1}><div class="h-full bg-primary transition-[width]" style:width={`${progress}%`}></div></div></div>{@render children?.()}</div>
