<script lang="ts">
  import type { CalendarValue } from '@fex/components-core/calendar'
  import { formatDatePickerValue } from '@fex/components-core/date-picker/value'
  import { datePickerMultipleTagsClassName, datePickerTagClassName, datePickerTagOverflowClassName, datePickerTagRemoveClassName } from '@fex/components-styles/date-picker'
  import { cn } from '@fex/utils'
  import { getContext } from 'svelte'
  import CloseIcon from '../../icon/close.svelte'
  import { datePickerContextKey, type DatePickerContextValue } from './context'

  interface Props { class?: string; maxTagCount?: number }
  let { class: className, maxTagCount = 1 }: Props = $props()
  const context = getContext<DatePickerContextValue>(datePickerContextKey)
  if (!context) throw new Error('DatePickerTags must be used within DatePickerRoot')
  const rootClassName = $derived(cn(datePickerMultipleTagsClassName, className))
  const visibleValues = $derived(context.getCalendarValues().slice(0, maxTagCount))
  const overflowCount = $derived(Math.max(context.getCalendarValues().length - maxTagCount, 0))
  function label(value: CalendarValue) { return formatDatePickerValue(value, context) }
  function remove(value: CalendarValue, event: Event) {
    event.preventDefault()
    event.stopPropagation()
    context.select(value)
  }
</script>

<div data-slot="date-picker-tags" class={rootClassName}>
  {#each visibleValues as value (label(value))}
    <span data-slot="date-picker-tag" class={datePickerTagClassName}>
      {label(value)}
      <button
        type="button"
        aria-label={`移除 ${label(value)}`}
        class={datePickerTagRemoveClassName}
        onpointerdown={(event) => event.stopPropagation()}
        onclick={(event) => remove(value, event)}
      >
        <CloseIcon />
      </button>
    </span>
  {/each}
  {#if overflowCount > 0}
    <span data-slot="date-picker-tag-overflow" class={datePickerTagOverflowClassName}>+{overflowCount}</span>
  {/if}
</div>
