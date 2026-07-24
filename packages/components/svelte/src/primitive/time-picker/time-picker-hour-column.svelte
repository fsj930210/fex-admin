<script lang="ts">
  import { createHourOptions, getDisplayedHour, getDisplayedPeriod, resolveDisabledTime } from '@fex/components-core/time-picker/options'
  import { getContext } from 'svelte'
  import { timePickerContextKey, type TimePickerContext } from './context'
  import TimePickerColumn from './time-picker-column.svelte'
  let { step, disabled = false, isItemDisabled }: { step?: number | undefined; disabled?: boolean | undefined; isItemDisabled?: ((value: number) => boolean) | undefined } = $props()
  const context = getContext<TimePickerContext>(timePickerContextKey)
  const options = $derived(createHourOptions({ step, use12Hours: context.use12Hours(), period: context.snapshot().value ? getDisplayedPeriod(context.snapshot().value!) : 'am', disabled: resolveDisabledTime(context.disabledTime(), context.snapshot().value).hours }).map(item => ({ ...item, disabled: item.disabled || Boolean(isItemDisabled?.(item.value)) })))
  const selected = $derived(context.snapshot().value ? getDisplayedHour(context.snapshot().value!, context.use12Hours()) : undefined)
</script>
<TimePickerColumn {options} selectedValue={selected} {disabled} onselect={value => context.controller.selectHour(value as number, context.use12Hours())} />
