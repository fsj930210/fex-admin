<script lang="ts">
  import { formatDatePickerValue, parseDatePickerValue } from '@fex/components-core/date-picker/value'
  import { datePickerMultipleInputClassName, datePickerTriggerClassName } from '@fex/components-styles/date-picker'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import CalendarIcon from '../../icon/calendar.svelte'
  import InputClear from '../input/input-clear.svelte'
  import InputControl from '../input/input-control.svelte'
  import InputRoot from '../input/input-root.svelte'
  import InputSuffix from '../input/input-suffix.svelte'
  import PopoverTrigger from '../popover/popover-trigger.svelte'
  import { useDatePickerContext } from './context'
  import DatePickerTags from './date-picker-tags.svelte'

  let { class: className, displayValue: displayValueProp, placeholder, suffix, status }: { class?: string | undefined; displayValue?: string | undefined; placeholder?: string | undefined; suffix?: Snippet | undefined; status?: 'error' | 'warning' | undefined } = $props()
  const context = useDatePickerContext('DatePickerTrigger')
  const pickerDisplayValue = $derived(Array.isArray(context.getValue()) ? (context.getValue() as readonly never[]).map((item) => formatDatePickerValue(item, context)).join(', ') : formatDatePickerValue(context.getValue() as never, context))
  const displayValue = $derived(displayValueProp ?? pickerDisplayValue)
  // svelte-ignore state_referenced_locally -- the effect below owns subsequent synchronization.
  let text = $state(displayValue)
  let inputControl: { focus: () => void } | undefined = undefined
  $effect(() => { text = displayValue })
  function input(nextText: string) { text = nextText; if (context.multiple) return; const result = parseDatePickerValue(nextText, context); if (result.valid) context.select(result.value as never) }
  function open(event: MouseEvent) {
    if (context.disabled) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
    inputControl?.focus()
    context.openPanel()
  }
</script>

<PopoverTrigger>{#snippet children(slot)}
  <InputRoot
    action={slot.action}
    aria-haspopup={slot.props['aria-haspopup']}
    aria-expanded={slot.props['aria-expanded']}
    data-state={slot.props['data-state']}
    value={context.multiple ? '' : text}
    disabled={context.disabled}
    readOnly={context.readOnly}
    status={status ?? context.status}
    class={cn(datePickerTriggerClassName, className)}
    onValueChange={input}
    onClear={context.allowClear ? context.clear : undefined}
    onclick={open}
  >
    {#if context.multiple && displayValue}<DatePickerTags />{/if}
    <InputControl
      bind:this={inputControl}
      class={context.multiple && displayValue ? datePickerMultipleInputClassName : undefined}
      placeholder={context.multiple && displayValue ? '' : placeholder ?? context.format}
      onfocus={() => context.openPanel()}
    />
    {#if context.allowClear && displayValue}<InputClear onpointerdown={(event) => event.stopPropagation()} onclick={(event) => { event.stopPropagation(); context.clear() }} />{/if}
    {#if !context.allowClear || !displayValue}<InputSuffix>{#if suffix}{@render suffix()}{:else}<CalendarIcon />{/if}</InputSuffix>{/if}
  </InputRoot>
{/snippet}</PopoverTrigger>
