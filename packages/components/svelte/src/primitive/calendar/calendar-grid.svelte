<script lang="ts">
  import type { CalendarCell } from '@fex/components-core/calendar'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { calendarContextKey, type CalendarContextValue } from './context'

  interface CalendarGridProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet<[CalendarCell]> | undefined
  }

  let { children, ...rest }: CalendarGridProps = $props()
  const context = getContext<CalendarContextValue>(calendarContextKey)
</script>

<div {...rest} data-slot="calendar-grid">
  {#each context.getGrid().rows as row (row.map((cell) => cell.key).join('|'))}
    <div data-slot="calendar-row">
      {#each row as cell (cell.key)}
        {@render children?.(cell)}
      {/each}
    </div>
  {/each}
</div>
