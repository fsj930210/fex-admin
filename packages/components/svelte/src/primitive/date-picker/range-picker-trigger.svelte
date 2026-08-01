<script lang="ts">
  import { getRangeInputPreviewValue } from '@fex/components-core/date-picker/range'
  import { formatDatePickerValue, parseDatePickerValue } from '@fex/components-core/date-picker/value'
  import { datePickerRangeInputClassName, datePickerRangeInputControlClassName, datePickerRangeSeparatorClassName, datePickerRangeTriggerClassName } from '@fex/components-styles/date-picker'
  import { cn } from '@fex/utils'
  import CalendarIcon from '../../icon/calendar.svelte'
  import InputClear from '../input/input-clear.svelte'
  import InputControl from '../input/input-control.svelte'
  import InputRoot from '../input/input-root.svelte'
  import InputSuffix from '../input/input-suffix.svelte'
  import PopoverTrigger from '../popover/popover-trigger.svelte'
  import { useRangePickerContext } from './context'

  let { class: className, startPlaceholder = '开始日期', endPlaceholder = '结束日期', separator = '→', status }: { class?: string; startPlaceholder?: string; endPlaceholder?: string; separator?: string; status?: 'error' | 'warning' } = $props()
  const context = useRangePickerContext('RangePickerTrigger')
  const startValue = $derived(formatDatePickerValue(context.getRangeValue().start ?? null, context))
  const endValue = $derived(formatDatePickerValue(context.getRangeValue().end ?? null, context))
  // svelte-ignore state_referenced_locally -- the effect below owns subsequent synchronization.
  let startText = $state(startValue)
  // svelte-ignore state_referenced_locally -- the effect below owns subsequent synchronization.
  let endText = $state(endValue)
  let focusedPart = $state<'start' | 'end' | null>(null)
  $effect(() => { startText = startValue; endText = endValue })
  $effect(() => { if (!context.getOpen()) focusedPart = null })
  const previewStartValue = $derived(getRangeInputPreviewValue(context.getRangeValue(), context.getHoverValue(), context.getActivePart(), 'start'))
  const previewEndValue = $derived(getRangeInputPreviewValue(context.getRangeValue(), context.getHoverValue(), context.getActivePart(), 'end'))
  const previewStartText = $derived(context.getActivePart() === 'start' && previewStartValue ? formatDatePickerValue(previewStartValue, context) : startText)
  const previewEndText = $derived(context.getActivePart() === 'end' && previewEndValue ? formatDatePickerValue(previewEndValue, context) : endText)
  const hasValue = $derived(Boolean(context.getRangeValue().start || context.getRangeValue().end))
  function input(part: 'start' | 'end', text: string) { if (part === 'start') startText = text; else endText = text; context.setActivePart(part); context.setHoverValue(null); const result = parseDatePickerValue(text, context); if (result.valid) context.select(result.value as never) }
  function focus(part: 'start' | 'end') { context.setActivePart(part); focusedPart = part; context.openPanel(part) }
  function open(event: MouseEvent) {
    if (context.disabled) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
    const part = (event.target as HTMLElement).closest('[data-range-part]')?.getAttribute('data-range-part')
    context.openPanel(part === 'start' || part === 'end' ? part : undefined)
  }
</script>

<PopoverTrigger>{#snippet children(slot)}
  <InputRoot
    action={slot.action}
    aria-haspopup={slot.props['aria-haspopup']}
    aria-expanded={slot.props['aria-expanded']}
    data-state={slot.props['data-state']}
    value=""
    disabled={context.disabled}
    readOnly={context.readOnly}
    status={status ?? context.status}
    class={cn(datePickerRangeTriggerClassName, className)}
    onValueChange={() => undefined}
    onclick={open}
  >
    <InputRoot data-range-part="start" data-active={(context.getOpen() ? context.getActivePart() === 'start' : focusedPart === 'start') || undefined} value={previewStartText} readOnly={context.readOnly} class={datePickerRangeInputClassName} onValueChange={(value) => input('start', value)}><InputControl class={cn(datePickerRangeInputControlClassName, previewStartText !== startText && 'text-muted-foreground')} placeholder={startPlaceholder} onfocus={() => focus('start')} /></InputRoot>
    <span aria-hidden="true" class={datePickerRangeSeparatorClassName}>{separator}</span>
    <InputRoot data-range-part="end" data-active={(context.getOpen() ? context.getActivePart() === 'end' : focusedPart === 'end') || undefined} value={previewEndText} readOnly={context.readOnly} class={datePickerRangeInputClassName} onValueChange={(value) => input('end', value)}><InputControl class={cn(datePickerRangeInputControlClassName, previewEndText !== endText && 'text-muted-foreground')} placeholder={endPlaceholder} onfocus={() => focus('end')} /></InputRoot>
    {#if context.allowClear && hasValue}<InputClear forceMount onpointerdown={(event) => event.stopPropagation()} onclick={(event) => { event.stopPropagation(); context.clear() }} />{:else}<InputSuffix><CalendarIcon /></InputSuffix>{/if}
  </InputRoot>
{/snippet}</PopoverTrigger>
