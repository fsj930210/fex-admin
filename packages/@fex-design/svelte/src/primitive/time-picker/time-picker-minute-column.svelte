<script lang="ts">
  import { createMinuteOptions, resolveDisabledTime } from '@fex-design/core/time-picker/options'
  import { getContext } from 'svelte'
  import { timePickerContextKey, type TimePickerContext } from './context'
  import TimePickerColumn from './time-picker-column.svelte'
  let { class: className, step, disabled = false, isItemDisabled }: { class?: string | undefined; step?: number | undefined; disabled?: boolean | undefined; isItemDisabled?: ((value: number) => boolean) | undefined } = $props()
  const context = getContext<TimePickerContext>(timePickerContextKey)
  const options = $derived(createMinuteOptions(step, resolveDisabledTime(context.disabledTime(), context.snapshot().value).minutes).map(item => ({ ...item, disabled: item.disabled || Boolean(isItemDisabled?.(item.value)) })))
</script>
<TimePickerColumn class={className} {options} selectedValue={context.snapshot().value?.minute} {disabled} onselect={value => context.controller.selectMinute(value as number)} />
