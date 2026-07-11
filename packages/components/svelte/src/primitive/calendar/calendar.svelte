<script lang="ts">
  import {
    createCalendarGrid,
    getCalendarToday,
    type CalendarDate,
    type CalendarGranularity,
    type CalendarPanel,
    type CalendarValue,
    type CalendarWeekday,
  } from '@fex/components-core/calendar'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { setContext } from 'svelte'
  import { calendarContextKey, type CalendarContextValue } from './context'

  interface CalendarRootProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    value?: CalendarValue | null | undefined
    defaultValue?: CalendarValue | null | undefined
    viewDate?: CalendarDate | undefined
    defaultViewDate?: CalendarDate | undefined
    panel?: CalendarPanel | undefined
    defaultPanel?: CalendarPanel | undefined
    granularity?: CalendarGranularity | undefined
    weekStartsOn?: CalendarWeekday | undefined
    today?: CalendarDate | undefined
    min?: CalendarDate | undefined
    max?: CalendarDate | undefined
    disabledDate?: ((date: CalendarDate) => boolean) | undefined
    children?: Snippet | undefined
    onValueChange?: ((value: CalendarValue) => void) | undefined
    onViewDateChange?: ((viewDate: CalendarDate) => void) | undefined
    onPanelChange?: ((panel: CalendarPanel) => void) | undefined
  }

  let {
    value,
    defaultValue = null,
    viewDate,
    defaultViewDate = getCalendarToday(),
    panel,
    defaultPanel = 'date',
    granularity = 'date',
    weekStartsOn = 0,
    today,
    min,
    max,
    disabledDate,
    children,
    onValueChange,
    onViewDateChange,
    onPanelChange,
    ...rest
  }: CalendarRootProps = $props()

  let internalValue: CalendarValue | null = $state(defaultValue)
  let internalViewDate: CalendarDate = $state(defaultViewDate)
  let internalPanel: CalendarPanel = $state(defaultPanel)
  const currentValue: CalendarValue | null = $derived(value ?? internalValue)
  const currentViewDate: CalendarDate = $derived(viewDate ?? internalViewDate)
  const currentPanel: CalendarPanel = $derived(panel ?? internalPanel)
  const grid = $derived(
    createCalendarGrid({
      viewDate: currentViewDate,
      panel: currentPanel,
      granularity,
      weekStartsOn,
      ...(today ? { today } : {}),
      ...(min ? { min } : {}),
      ...(max ? { max } : {}),
      ...(disabledDate ? { disabledDate } : {}),
      ...(currentValue ? { value: currentValue } : {}),
    }),
  )

  function setViewDate(nextViewDate: CalendarDate) {
    if (viewDate === undefined) internalViewDate = nextViewDate
    onViewDateChange?.(nextViewDate)
  }

  function setPanel(nextPanel: CalendarPanel) {
    if (panel === undefined) internalPanel = nextPanel
    onPanelChange?.(nextPanel)
  }

  const context: CalendarContextValue = {
    getGrid: () => grid,
    getValue: () => currentValue,
    getViewDate: () => currentViewDate,
    getPanel: () => currentPanel,
    getGranularity: () => granularity,
    getWeekStartsOn: () => weekStartsOn,
    setViewDate,
    setPanel,
    selectCell: (cell) => {
      if (cell.state.disabled) return
      if (value === undefined) internalValue = cell.value
      onValueChange?.(cell.value)
    },
  }

  setContext(calendarContextKey, context)
</script>

<div {...rest} data-slot="calendar-root" data-panel={currentPanel} data-granularity={granularity}>
  {@render children?.()}
</div>
