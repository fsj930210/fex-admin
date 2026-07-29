<script lang="ts">
  import type { CalendarDate, CalendarRange, CalendarValue, CalendarWeekday } from '@fex/components-core/calendar'
  import type { DatePickerPicker } from '@fex/components-core/date-picker/types'
  import type { Snippet } from 'svelte'
  import { setContext } from 'svelte'
  import Popover from '../popover/popover.svelte'
  import { rangePickerContextKey } from './context'
  import { useRangePicker } from './date-picker-state.svelte'

  interface Props {
    children?: Snippet
    value?: CalendarRange<CalendarValue>
    defaultValue?: CalendarRange<CalendarValue>
    open?: boolean
    defaultOpen?: boolean
    picker?: DatePickerPicker
    needConfirm?: boolean
    disabled?: boolean
    readOnly?: boolean
    allowClear?: boolean
    allowEmpty?: boolean | { start?: boolean; end?: boolean }
    order?: boolean
    format?: string
    weekStartsOn?: CalendarWeekday
    minDate?: CalendarDate
    maxDate?: CalendarDate
    disabledDate?: (date: CalendarDate, activePart: 'start' | 'end') => boolean
    onChange?: (value: CalendarRange<CalendarValue>) => void
    onOpenChange?: (open: boolean) => void
  }
  let props: Props = $props()
  const picker = useRangePicker<CalendarValue>(props)
  setContext(rangePickerContextKey, picker)
</script>

<Popover open={picker.getOpen()} trigger={['focus', 'click']} placement="bottom" sideOffset={6} onOpenChange={(open) => picker.setOpen(open)}>
  {@render props.children?.()}
</Popover>
