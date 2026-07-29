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
    value?: DatePickerSelectionValue
    defaultValue?: DatePickerSelectionValue
    open?: boolean
    defaultOpen?: boolean
    picker?: DatePickerPicker
    status?: 'error' | 'warning'
    multiple?: boolean
    needConfirm?: boolean
    disabled?: boolean
    readOnly?: boolean
    allowClear?: boolean
    format?: string
    weekStartsOn?: CalendarWeekday
    minDate?: CalendarDate
    maxDate?: CalendarDate
    disabledDate?: (date: CalendarDate) => boolean
    onChange?: (value: DatePickerSelectionValue) => void
    onOpenChange?: (open: boolean) => void
  }
  let props: Props = $props()
  const picker = useDatePicker<CalendarValue>(props)
  setContext(datePickerContextKey, picker)
</script>

<Popover open={picker.getOpen()} trigger={['focus', 'click']} placement="bottom" sideOffset={6} onOpenChange={(open) => picker.setOpen(open)}>
  {@render props.children?.()}
</Popover>
