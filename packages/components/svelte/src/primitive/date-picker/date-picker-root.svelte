<script lang="ts">
  import type { CalendarDate, CalendarValue, CalendarWeekday } from '@fex/components-core/calendar'
  import type { DatePickerPicker } from '@fex/components-core/date-picker/types'
  import type { Snippet } from 'svelte'
  import { setContext } from 'svelte'
  import Popover from '../popover/popover.svelte'
  import { datePickerContextKey, type DatePickerSelectionValue } from './context'
  import { useDatePicker } from './date-picker-state.svelte'

  interface Props {
    children?: Snippet
    value?: DatePickerSelectionValue | undefined
    defaultValue?: DatePickerSelectionValue | undefined
    open?: boolean | undefined
    defaultOpen?: boolean | undefined
    picker?: DatePickerPicker | undefined
    status?: 'error' | 'warning' | undefined
    multiple?: boolean | undefined
    needConfirm?: boolean | undefined
    disabled?: boolean | undefined
    readOnly?: boolean | undefined
    allowClear?: boolean | undefined
    format?: string | undefined
    weekStartsOn?: CalendarWeekday | undefined
    minDate?: CalendarDate | undefined
    maxDate?: CalendarDate | undefined
    disabledDate?: ((date: CalendarDate) => boolean) | undefined
    onChange?: ((value: DatePickerSelectionValue) => void) | undefined
    onOpenChange?: ((open: boolean) => void) | undefined
  }
  let props: Props = $props()
  // svelte-ignore state_referenced_locally -- the props proxy remains live inside the controller adapter.
  const picker = useDatePicker<CalendarValue>(props)
  setContext(datePickerContextKey, picker)
</script>

<Popover open={picker.getOpen()} trigger={['focus', 'click']} placement="bottom" sideOffset={6} onOpenChange={(open) => picker.setOpen(open)}>
  {@render props.children?.()}
</Popover>
