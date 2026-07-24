<script lang="ts">
  import { createMinuteOptions, resolveDisabledTime } from '@fex/components-core/time-picker/options'
  import { getContext } from 'svelte'
  import { timePickerContextKey, type TimePickerContext } from './context'
  import TimePickerColumn from './time-picker-column.svelte'
  let { step, disabled = false, isItemDisabled }: { step?: number | undefined; disabled?: boolean | undefined; isItemDisabled?: ((value: number) => boolean) | undefined } = $props()
  const context = getContext<TimePickerContext>(timePickerContextKey)
  const options = $derived(createMinuteOptions(step, resolveDisabledTime(context.disabledTime(), context.snapshot().value).minutes).map(item => ({ ...item, disabled: item.disabled || Boolean(isItemDisabled?.(item.value)) })))
</script>
<TimePickerColumn {options} selectedValue={context.snapshot().value?.minute} {disabled} onselect={value => context.controller.selectMinute(value as number)} />
