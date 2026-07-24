<script lang="ts">
  import { analyzeTimeFormat } from '@fex/components-core/date/utils'
  import CalendarIcon from '@fex/components-svelte/icon/calendar'
  import ClockIcon from '@fex/components-svelte/icon/clock'
  import { TimePickerContent, TimePickerHourColumn, TimePickerMinuteColumn, TimePickerPanel, TimePickerPeriodColumn, TimePickerRoot, TimePickerSecondColumn, TimePickerTrigger, type DisabledTime, type TimeValue } from '@fex/components-svelte/primitive/time-picker'
  import Button from '@fex/components-svelte/ui/button'
  let { value, defaultValue = null, onchange, use12Hours = false, format, step, disabledTime, disabled = false, invalid = false, prefix, calendarSuffix = false, panelExtra = false }: { value?: TimeValue | null; defaultValue?: TimeValue | null; onchange?: (value: TimeValue | null) => void; use12Hours?: boolean; format?: string; step?: { hour?: number; minute?: number; second?: number }; disabledTime?: DisabledTime; disabled?: boolean; invalid?: boolean; prefix?: string; calendarSuffix?: boolean; panelExtra?: boolean } = $props()
  let open = $state(false)
  const pattern = $derived(format ?? (use12Hours ? 'hh:mm:ss A' : 'HH:mm:ss'))
  const columns = $derived(analyzeTimeFormat(pattern, use12Hours).columns)
</script>

<TimePickerRoot {value} {defaultValue} {use12Hours} {disabled} {disabledTime} format={pattern} {open} onOpenChange={(next) => open = next} onchange={(next) => onchange?.(next)} placement="bottomLeft">
  <TimePickerTrigger class="w-56" {invalid}>
    {#snippet prefix()}{#if prefix}<span>{prefix}</span>{/if}{/snippet}
    {#snippet suffix()}{#if calendarSuffix}<CalendarIcon class="size-4" />{:else}<ClockIcon class="size-4" />{/if}{/snippet}
  </TimePickerTrigger>
  <TimePickerContent>
    <TimePickerPanel>{#each columns as column (column.unit)}{#if column.unit === 'hour'}<TimePickerHourColumn step={step?.hour} />{:else if column.unit === 'minute'}<TimePickerMinuteColumn step={step?.minute} />{:else if column.unit === 'second'}<TimePickerSecondColumn step={step?.second} />{:else}<TimePickerPeriodColumn />{/if}{/each}</TimePickerPanel>
    {#if panelExtra}<div class="border-t border-border p-space-sm text-sm"><button type="button" class="text-primary">选择当前时间</button></div>{/if}
    <div class="flex justify-end border-t border-border p-space-sm"><Button size="sm" variant="ghost" onclick={() => open = false}>确定</Button></div>
  </TimePickerContent>
</TimePickerRoot>
