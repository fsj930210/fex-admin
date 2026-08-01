<script lang="ts">
  import { getRangePanelViewDates } from '@fex/components-core/date-picker/panel'
  import { datePickerPanelsClassName } from '@fex/components-styles/date-picker'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import { useRangePickerContext } from './context'
  import RangePickerPanel from './range-picker-panel.svelte'

  let { class: className, panelCount = 2, children }: { class?: string; panelCount?: 1 | 2; children?: Snippet } = $props()
  const context = useRangePickerContext('RangePickerPanelGroup')
  const dates = $derived(getRangePanelViewDates(context.getViewDate(), context.getPanel()))
  const visibleDates = $derived(panelCount === 1 ? [dates[0]] : dates)
</script>

<div role="group" class={cn(datePickerPanelsClassName, className)} onmouseleave={() => context.setHoverValue(null)}>
  {#if children}
    {@render children()}
  {:else}
    {#each visibleDates as date, index (`${date.year}-${date.month}-${index}`)}
      <RangePickerPanel panelViewDate={date} />
    {/each}
  {/if}
</div>
