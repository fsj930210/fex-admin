<script lang="ts">
  import { getCalendarToday, type CalendarDate, type CalendarRange } from '@fex/components-core/calendar'
  import { formatDatePickerValue } from '@fex/components-core/date-picker/value'
  import { endOfDate } from '@fex/components-core/date/utils'
  import { DatePickerPreset, RangePickerPanelGroup, useRangePickerContext } from '@fex/components-svelte/primitive/date-picker'

  let { onSelect }: { onSelect: (value: CalendarRange) => void } = $props()
  const today = getCalendarToday()
  const rangePicker = useRangePickerContext('PresetRangePanel')
  const presets: Array<[string, CalendarRange]> = [
    ['最近 7 天', lastDays(7)],
    ['最近 30 天', lastDays(30)],
    ['本月', thisMonth()],
    ['上月', previousMonth()],
  ]

  function select(value: CalendarRange) {
    onSelect(value)
    if (value.start) rangePicker.setViewDate(value.start as CalendarDate)
  }

  function lastDays(days: number): CalendarRange {
    return { start: today.subtract({ days: days - 1 }), end: today }
  }

  function thisMonth(): CalendarRange {
    return { start: today.with({ day: 1 }), end: endOfDate(today, 'month') }
  }

  function previousMonth(): CalendarRange {
    const end = today.with({ day: 1 }).subtract({ days: 1 })
    return { start: end.with({ day: 1 }), end }
  }

  function isSelected(value: CalendarRange) {
    return getRangeKey(rangePicker.getRangeValue()) === getRangeKey(value)
  }

  function getRangeKey(value: CalendarRange) {
    return `${value.start ? formatDatePickerValue(value.start, { picker: 'date' }) : ''}~${value.end ? formatDatePickerValue(value.end, { picker: 'date' }) : ''}`
  }
</script>

<div class="flex">
  <div class="flex w-32 shrink-0 flex-col gap-1 border-r border-border p-2">
    {#each presets as [label, value] (label)}
      <DatePickerPreset class="justify-start" data-selected={isSelected(value)} onclick={() => select(value)}>{#snippet children()}{label}{/snippet}</DatePickerPreset>
    {/each}
  </div>
  <RangePickerPanelGroup />
</div>
