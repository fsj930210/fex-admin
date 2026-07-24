<script lang="ts">
  import { format as formatDate, parse } from '@fex/components-core/date/utils'
  import { getContext, type Snippet } from 'svelte'
  import ClockIcon from '../../icon/clock.svelte'
  import InputRoot from '../input/input-root.svelte'
  import InputControl from '../input/input-control.svelte'
  import InputClear from '../input/input-clear.svelte'
  import InputPrefix from '../input/input-prefix.svelte'
  import InputSuffix from '../input/input-suffix.svelte'
  import PopoverTrigger from '../popover/popover-trigger.svelte'
  import { timePickerContextKey, type TimePickerContext } from './context'
  let { allowClear = true, placeholder, invalid = false, prefix, suffix }: { allowClear?: boolean; placeholder?: string; invalid?: boolean; prefix?: Snippet; suffix?: Snippet } = $props()
  const context = getContext<TimePickerContext>(timePickerContextKey)
  let text = $state(context.snapshot().value ? formatDate(context.snapshot().value!, context.format()) : '')
  $effect(() => { const value = context.snapshot().value; text = value ? formatDate(value, context.format()) : '' })
  function input(value: string) { text = value; const result = parse(value, context.format()); if (result.valid) context.controller.change(result.value, 'input', 'smooth') }
  function clear() { text = ''; context.controller.clear() }
  function bridge<T extends Event>(handler: ((event: T) => void) | null | undefined, event: T) { handler?.(event) }
</script>
<PopoverTrigger>{#snippet children(slot)}<div use:slot.action class="inline-block" aria-haspopup="dialog" aria-expanded={slot.state.open} data-state={slot.state.open ? 'open' : 'closed'} onclick={event => bridge(slot.props.onclick, event as never)} onpointerenter={event => bridge(slot.props.onpointerenter, event as never)} onpointerleave={event => bridge(slot.props.onpointerleave, event as never)} onfocus={event => bridge(slot.props.onfocus, event as never)} onblur={event => bridge(slot.props.onblur, event as never)} oncontextmenu={event => bridge(slot.props.oncontextmenu, event as never)}><InputRoot value={text} disabled={context.disabled()} readOnly={context.readOnly()} {invalid} onValueChange={input} onClear={clear}>{#if prefix}<InputPrefix>{@render prefix()}</InputPrefix>{/if}<InputControl aria-label="Time" placeholder={placeholder ?? context.format()} />{#if allowClear}<InputClear />{/if}{#if !allowClear || !text}<InputSuffix>{#if suffix}{@render suffix()}{:else}<ClockIcon class="size-4" />{/if}</InputSuffix>{/if}</InputRoot></div>{/snippet}</PopoverTrigger>
