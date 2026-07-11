<script lang="ts">
  import type { CalendarCell } from '@fex/components-core/calendar'
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { calendarContextKey, type CalendarContextValue } from './context'

  interface CalendarCellProps extends Omit<HTMLButtonAttributes, 'children' | 'type'> {
    cell: CalendarCell
    children?: Snippet<[CalendarCell]> | undefined
  }

  let { cell, children, onclick, ...rest }: CalendarCellProps = $props()
  const context = getContext<CalendarContextValue>(calendarContextKey)
</script>

<button
  {...rest}
  type="button"
  data-slot="calendar-cell"
  data-today={cell.state.today ? 'true' : undefined}
  data-outside={cell.state.outside ? 'true' : undefined}
  data-selected={cell.state.selected ? 'true' : undefined}
  data-disabled={cell.state.disabled ? 'true' : undefined}
  disabled={cell.state.disabled}
  onclick={(event) => {
    onclick?.(event)
    if (event.defaultPrevented) return
    context.selectCell(cell)
  }}
>
  {@render children?.(cell)}
</button>
