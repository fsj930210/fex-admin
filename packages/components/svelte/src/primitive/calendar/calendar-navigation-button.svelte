<script lang="ts">
  import { addDate, subtractDate } from '@fex/components-core/calendar'
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { calendarContextKey, type CalendarContextValue } from './context'

  type CalendarNavigationAction = 'previous-year' | 'previous-month' | 'next-month' | 'next-year' | 'previous-panel' | 'next-panel'

  interface CalendarNavigationButtonProps extends Omit<HTMLButtonAttributes, 'children' | 'type'> {
    action: CalendarNavigationAction
    children?: Snippet | undefined
  }

  let { action, children, onclick, ...rest }: CalendarNavigationButtonProps = $props()
  const context = getContext<CalendarContextValue>(calendarContextKey)

  function runAction() {
    if (action === 'previous-year') context.setViewDate(subtractDate(context.getViewDate(), { years: 1 }))
    if (action === 'previous-month') context.setViewDate(subtractDate(context.getViewDate(), { months: 1 }))
    if (action === 'next-month') context.setViewDate(addDate(context.getViewDate(), { months: 1 }))
    if (action === 'next-year') context.setViewDate(addDate(context.getViewDate(), { years: 1 }))
    if (action === 'previous-panel') context.setViewDate(context.getPanel() === 'date' ? subtractDate(context.getViewDate(), { months: 1 }) : subtractDate(context.getViewDate(), { years: 1 }))
    if (action === 'next-panel') context.setViewDate(context.getPanel() === 'date' ? addDate(context.getViewDate(), { months: 1 }) : addDate(context.getViewDate(), { years: 1 }))
  }
</script>

<button
  {...rest}
  type="button"
  data-slot="calendar-navigation-button"
  data-action={action}
  onclick={(event) => {
    onclick?.(event)
    if (event.defaultPrevented) return
    runAction()
  }}
>
  {@render children?.()}
</button>
