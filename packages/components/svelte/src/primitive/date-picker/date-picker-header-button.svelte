<script lang="ts">
  import { getNextViewDateByHeaderAction } from '@fex/components-core/date-picker/panel'
  import type { DatePickerHeaderAction } from '@fex/components-core/date-picker/types'
  import { datePickerHeaderDoubleIconClassName, datePickerHeaderNavigationClassName } from '@fex/components-styles/date-picker'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import ChevronLeftIcon from '../../icon/chevron-left.svelte'
  import ChevronRightIcon from '../../icon/chevron-right.svelte'
  import Button from '../button/button.svelte'
  import { calendarContextKey, type CalendarContextValue } from '../calendar/context'
  import { useHeaderOwner } from './date-picker-header-owner'

  interface Props extends Omit<HTMLButtonAttributes, 'children' | 'type'> {
    action: DatePickerHeaderAction
    children?: Snippet
  }
  let { action, class: className, children, onclick, ...rest }: Props = $props()
  const owner = useHeaderOwner('DatePickerHeaderButton')
  const calendar = getContext<CalendarContextValue>(calendarContextKey)
  const isPrevious = $derived(action.startsWith('previous'))
  const isDouble = $derived(action.includes('year') || action.includes('panel'))

  function runAction(event: MouseEvent) {
    onclick?.(event)
    if (event.defaultPrevented) return
    const nextViewDate = getNextViewDateByHeaderAction(calendar.getViewDate(), action, calendar.getPanel())
    calendar.setViewDate(nextViewDate)
    owner.setViewDate(nextViewDate)
  }
</script>

<Button {...rest} data-slot="date-picker-header-button" data-action={action} class={cn(datePickerHeaderNavigationClassName, className)} onclick={runAction}>
  {#if children}
    {@render children()}
  {:else}
    <span class="flex items-center">
      {#if isDouble}
        {#if isPrevious}
          <ChevronLeftIcon class="size-4" /><ChevronLeftIcon class={cn(datePickerHeaderDoubleIconClassName, 'size-4')} />
        {:else}
          <ChevronRightIcon class="size-4" /><ChevronRightIcon class={cn(datePickerHeaderDoubleIconClassName, 'size-4')} />
        {/if}
      {:else if isPrevious}
        <ChevronLeftIcon class="size-4" />
      {:else}
        <ChevronRightIcon class="size-4" />
      {/if}
    </span>
  {/if}
</Button>
