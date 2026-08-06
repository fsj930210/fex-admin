<script lang="ts">
  import TourControl from '@fex-design/svelte/primitive/tour-control'
  import { getContext } from 'svelte'
  import { tourContextKey, type TourContext } from '@fex-design/svelte/primitive/tour-context'
  const { snapshot } = getContext<TourContext>(tourContextKey)
</script>
<div class="flex justify-end gap-2"><TourControl action="previous">上一步</TourControl><TourControl action={$snapshot.isLast ? 'complete' : 'next'}>{$snapshot.isLast ? '完成' : '下一步'}</TourControl></div>
