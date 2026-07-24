<script lang="ts">
  import { createPeriodOptions, getDisplayedPeriod } from '@fex/components-core/time-picker/options'
  import type { TimePeriod } from '@fex/components-core/time-picker/types'
  import { getContext } from 'svelte'
  import { timePickerContextKey, type TimePickerContext } from './context'
  import TimePickerColumn from './time-picker-column.svelte'
  let { labels, disabled = false, isItemDisabled }: { labels?: { am: string; pm: string } | undefined; disabled?: boolean | undefined; isItemDisabled?: ((value: TimePeriod) => boolean) | undefined } = $props()
  const context = getContext<TimePickerContext>(timePickerContextKey)
  const options = $derived(createPeriodOptions(labels).map(item => ({ ...item, disabled: item.disabled || Boolean(isItemDisabled?.(item.value)) })))
  const selected = $derived(context.snapshot().value ? getDisplayedPeriod(context.snapshot().value!) : undefined)
</script>
{#if context.use12Hours()}<TimePickerColumn {options} selectedValue={selected} {disabled} onselect={value => context.controller.selectPeriod(value as TimePeriod)} />{/if}
