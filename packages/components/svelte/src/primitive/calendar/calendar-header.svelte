<script lang="ts">
  import { addDate, subtractDate } from '@fex/components-core/calendar'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { calendarContextKey, type CalendarContextValue } from './context'

  interface CalendarHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet<[{
      viewDate: ReturnType<CalendarContextValue['getViewDate']>
      panel: ReturnType<CalendarContextValue['getPanel']>
      granularity: ReturnType<CalendarContextValue['getGranularity']>
      previousYear: () => void
      previousMonth: () => void
      nextMonth: () => void
      nextYear: () => void
      setPanel: CalendarContextValue['setPanel']
    }]> | undefined
  }

  let { children, ...rest }: CalendarHeaderProps = $props()
  const context = getContext<CalendarContextValue>(calendarContextKey)
</script>

<div {...rest} data-slot="calendar-header">
  {@render children?.({
    viewDate: context.getViewDate(),
    panel: context.getPanel(),
    granularity: context.getGranularity(),
    previousYear: () => context.setViewDate(subtractDate(context.getViewDate(), { years: 1 })),
    previousMonth: () => context.setViewDate(subtractDate(context.getViewDate(), { months: 1 })),
    nextMonth: () => context.setViewDate(addDate(context.getViewDate(), { months: 1 })),
    nextYear: () => context.setViewDate(addDate(context.getViewDate(), { years: 1 })),
    setPanel: context.setPanel,
  })}
</div>
