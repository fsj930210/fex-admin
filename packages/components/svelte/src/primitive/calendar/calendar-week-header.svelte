<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { calendarContextKey, type CalendarContextValue } from './context'

  interface CalendarWeekHeaderProps extends HTMLAttributes<HTMLDivElement> {
    labels?: readonly string[] | undefined
  }

  let { labels = ['日', '一', '二', '三', '四', '五', '六'], ...rest }: CalendarWeekHeaderProps = $props()
  const context = getContext<CalendarContextValue>(calendarContextKey)
  const orderedLabels = $derived(labels.map((_, index) => labels[(index + context.getWeekStartsOn()) % 7] ?? ''))
</script>

<div {...rest} data-slot="calendar-week-header">
  {#each orderedLabels as label (label)}
    <div data-slot="calendar-week-head">{label}</div>
  {/each}
</div>
