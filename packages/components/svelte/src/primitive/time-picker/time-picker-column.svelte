<script lang="ts">
  import type { TimePeriod, TimePickerOption } from '@fex/components-core/time-picker/types'
  import { timePickerColumnClassName, timePickerColumnItemClassName, timePickerColumnSpacerClassName, timePickerColumnViewportClassName } from '@fex/components-styles/time-picker'
  import { cn } from '@fex/utils'
  import { getContext, tick } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { timePickerContextKey, type TimePickerContext } from './context'
  import ScrollbarRoot from '../scrollbar/scrollbar.svelte'
  import ScrollbarViewport from '../scrollbar/scrollbar-viewport.svelte'
  import ScrollbarBar from '../scrollbar/scrollbar-bar.svelte'

  type ColumnValue = number | TimePeriod
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onselect'> {
    options: readonly TimePickerOption<ColumnValue>[]
    selectedValue?: ColumnValue | undefined
    disabled?: boolean | undefined
    onselect: (value: ColumnValue) => void
  }

  let { options, selectedValue, disabled = false, onselect, class: className, onkeydown, ...rest }: Props = $props()
  const context = getContext<TimePickerContext>(timePickerContextKey)
  if (!context) throw new Error('TimePickerColumn must be used inside TimePickerRoot.')
  let listElement: HTMLDivElement
  const itemElements = new Map<ColumnValue, HTMLButtonElement>()
  let activeValue = $state<ColumnValue>()
  const resolvedDisabled = $derived(context.disabled() || disabled)

  // DOM alignment follows committed values and explicit scroll requests.
  $effect(() => {
    const selected = selectedValue
    const request = context.snapshot().scrollRequest
    void tick().then(() => {
      const item = selected === undefined ? undefined : itemElements.get(selected)
      if (item && listElement) listElement.scrollTo({ top: item.offsetTop, behavior: request?.behavior ?? 'auto' })
    })
  })

  function move(direction: 1 | -1) {
    const enabled = options.filter(option => !option.disabled)
    const current = enabled.findIndex(option => option.value === activeValue)
    const next = enabled[Math.min(enabled.length - 1, Math.max(0, current + direction))]
    if (!next) return
    activeValue = next.value
    itemElements.get(next.value)?.focus()
  }

  function itemRef(node: HTMLButtonElement, value: ColumnValue) {
    itemElements.set(value, node)
    return { destroy: () => itemElements.delete(value) }
  }
</script>

<ScrollbarRoot data-slot="time-picker-column" data-disabled={resolvedDisabled ? 'true' : undefined} class={cn(timePickerColumnClassName, className)} {disabled}>
  <ScrollbarViewport {...rest} bind:element={listElement} role="listbox" tabindex={resolvedDisabled ? -1 : 0} aria-disabled={resolvedDisabled || undefined} overflowX="hidden" class={timePickerColumnViewportClassName} onkeydown={(event) => { onkeydown?.(event); if (event.defaultPrevented || resolvedDisabled || context.readOnly()) return; if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); move(event.key === 'ArrowDown' ? 1 : -1) } }}>
  {#each options as item (item.value)}
    <button use:itemRef={item.value} type="button" role="option" tabindex="-1" disabled={resolvedDisabled || item.disabled} aria-selected={item.value === selectedValue} data-selected={item.value === selectedValue ? 'true' : undefined} data-active={item.value === activeValue ? 'true' : undefined} data-disabled={item.disabled ? 'true' : undefined} class={timePickerColumnItemClassName} onfocus={() => activeValue = item.value} onclick={(event) => { const element = event.currentTarget; if (resolvedDisabled || context.readOnly() || item.disabled) return; activeValue = item.value; onselect(item.value); listElement?.scrollTo({ top: element.offsetTop, behavior: 'smooth' }) }}>{item.label}</button>
  {/each}
  <div aria-hidden="true" class={timePickerColumnSpacerClassName}></div>
  </ScrollbarViewport>
  <ScrollbarBar axis="y" />
</ScrollbarRoot>
