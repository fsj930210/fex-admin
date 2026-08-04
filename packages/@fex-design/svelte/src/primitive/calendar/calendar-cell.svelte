<script lang="ts">
  import type { CalendarCell } from '@fex-design/core/calendar'
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { calendarContextKey, type CalendarContextValue } from './context'

  interface CalendarCellProps extends Omit<HTMLButtonAttributes, 'children' | 'type'> {
    cell: CalendarCell
    children?: Snippet<[CalendarCell]> | undefined
  }

  let { cell, children, onclick, onpointerdown, ...rest }: CalendarCellProps = $props()
  const context = getContext<CalendarContextValue>(calendarContextKey)
</script>

<button
  {...rest}
  type="button"
  data-slot="calendar-cell"
  data-today={cell.state.today ? 'true' : undefined}
  data-outside={cell.state.outside ? 'true' : undefined}
  data-selected={cell.state.selected ? 'true' : undefined}
  data-range-start={cell.granularity !== 'week' && cell.state.rangeStart ? 'true' : undefined}
  data-range-end={cell.granularity !== 'week' && cell.state.rangeEnd ? 'true' : undefined}
  data-in-range={cell.granularity !== 'week' && cell.state.inRange ? 'true' : undefined}
  data-week-selected={cell.granularity === 'week' && cell.state.selected ? 'true' : undefined}
  data-week-hover={cell.granularity === 'week' && context.getHoveredRowIndex() === cell.rowIndex ? 'true' : undefined}
  data-week-row-start={cell.granularity === 'week' && cell.columnIndex === 0 ? 'true' : undefined}
  data-week-row-end={cell.granularity === 'week' && cell.columnIndex === 6 ? 'true' : undefined}
  data-week-start={cell.granularity === 'week' && cell.state.selected && cell.columnIndex === 0 ? 'true' : undefined}
  data-week-end={cell.granularity === 'week' && cell.state.selected && cell.columnIndex === 6 ? 'true' : undefined}
  data-week-range-start={cell.granularity === 'week' && cell.state.rangeStart && !cell.state.rangeEnd ? 'true' : undefined}
  data-week-range-end={cell.granularity === 'week' && cell.state.rangeEnd && !cell.state.rangeStart ? 'true' : undefined}
  data-week-range-single={cell.granularity === 'week' && cell.state.rangeStart && cell.state.rangeEnd ? 'true' : undefined}
  data-week-in-range={cell.granularity === 'week' && cell.state.inRange ? 'true' : undefined}
  data-week-range={cell.granularity === 'week' && (cell.state.rangeStart || cell.state.rangeEnd || cell.state.inRange) ? 'true' : undefined}
  data-disabled={cell.state.disabled ? 'true' : undefined}
  disabled={cell.state.disabled}
  onpointerdown={(event) => {
    onpointerdown?.(event)
    if (!event.defaultPrevented) event.preventDefault()
  }}
  onclick={(event) => {
    onclick?.(event)
    if (event.defaultPrevented) return
    context.selectCell(cell)
  }}
  onmouseenter={() => context.hoverCell(cell)}
>
  {@render children?.(cell)}
</button>
