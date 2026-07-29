<script lang="ts">
  import { getDatePickerHeaderLabelParts, getNextPanelByHeaderLabel } from '@fex/components-core/date-picker/panel'
  import type { DatePickerHeaderLabelPart } from '@fex/components-core/date-picker/types'
  import { datePickerHeaderLabelClassName } from '@fex/components-styles/date-picker'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import Button from '../button/button.svelte'
  import { calendarContextKey, type CalendarContextValue } from '../calendar/context'
  import { useHeaderOwner } from './date-picker-header-owner'

  interface Props extends Omit<HTMLButtonAttributes, 'children' | 'type'> {
    part: DatePickerHeaderLabelPart
    children?: Snippet
  }
  let { part, class: className, children, onclick, ...rest }: Props = $props()
  const owner = useHeaderOwner('DatePickerHeaderLabel')
  const calendar = getContext<CalendarContextValue>(calendarContextKey)
  let hovered = $state(false)
  const visible = $derived(getDatePickerHeaderLabelParts(owner.picker, calendar.getPanel()).includes(part))
  const label = $derived.by(() => {
    if (part === 'month') return `${calendar.getViewDate().month}月`
    const decadeStart = Math.floor(calendar.getViewDate().year / 10) * 10
    return calendar.getPanel() === 'decade' ? `${decadeStart}-${decadeStart + 9}年` : `${calendar.getViewDate().year}年`
  })

  function selectPanel(event: MouseEvent) {
    onclick?.(event)
    if (event.defaultPrevented) return
    const nextPanel = getNextPanelByHeaderLabel(part)
    calendar.setPanel(nextPanel)
    owner.setPanel(nextPanel)
  }
</script>

{#if visible}
  <Button
    {...rest}
    data-slot="date-picker-header-label"
    data-part={part}
    data-hovered={hovered ? 'true' : undefined}
    class={cn(datePickerHeaderLabelClassName, className)}
    onmouseenter={() => hovered = true}
    onmouseleave={() => hovered = false}
    onclick={selectPanel}
  >
    {#if children}{@render children()}{:else}{label}{/if}
  </Button>
{/if}
