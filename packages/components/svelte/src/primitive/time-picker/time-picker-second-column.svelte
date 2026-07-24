<script lang="ts">
  import { createSecondOptions, resolveDisabledTime } from '@fex/components-core/time-picker/options'
  import { getContext } from 'svelte'
  import { timePickerContextKey, type TimePickerContext } from './context'
  import TimePickerColumn from './time-picker-column.svelte'
  let { step, disabled = false, isItemDisabled }: { step?: number | undefined; disabled?: boolean | undefined; isItemDisabled?: ((value: number) => boolean) | undefined } = $props()
  const context = getContext<TimePickerContext>(timePickerContextKey)
  const options = $derived(createSecondOptions(step, resolveDisabledTime(context.disabledTime(), context.snapshot().value).seconds).map(item => ({ ...item, disabled: item.disabled || Boolean(isItemDisabled?.(item.value)) })))
</script>
<TimePickerColumn {options} selectedValue={context.snapshot().value?.second} {disabled} onselect={value => context.controller.selectSecond(value as number)} />
