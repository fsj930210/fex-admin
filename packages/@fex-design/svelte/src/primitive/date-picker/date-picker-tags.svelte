<script lang="ts">
  import type { CalendarValue } from '@fex-design/core/calendar'
  import { formatDatePickerValue } from '@fex-design/core/date-picker/value'
  import { datePickerMultipleTagsClassName } from '@fex-design/styles/date-picker'
  import { cn } from '@fex/utils'
  import { getContext } from 'svelte'
  import Tag from '../tag/tag.svelte'
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
    <Tag data-slot="date-picker-tag" size="sm" closable onpointerdown={(event) => event.stopPropagation()} onClose={(event) => remove(value, event)}>{label(value)}</Tag>
  {/each}
  {#if overflowCount > 0}
    <Tag data-slot="date-picker-tag-overflow" size="sm">+{overflowCount}</Tag>
  {/if}
</div>
