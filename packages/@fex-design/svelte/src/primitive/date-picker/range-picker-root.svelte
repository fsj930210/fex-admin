<script lang="ts">
  import type { CalendarDate, CalendarRange, CalendarValue, CalendarWeekday } from '@fex-design/core/calendar'
  import type { DatePickerPicker } from '@fex-design/core/date-picker/types'
  import type { Snippet } from 'svelte'
  import { setContext } from 'svelte'
  import Popover from '../popover/popover.svelte'
  import { rangePickerContextKey } from './context'
  import { useRangePicker } from './date-picker-state.svelte'

  interface Props {
    children?: Snippet
    value?: CalendarRange<CalendarValue> | undefined
    defaultValue?: CalendarRange<CalendarValue> | undefined
    open?: boolean | undefined
    defaultOpen?: boolean | undefined
    picker?: DatePickerPicker | undefined
    status?: 'error' | 'warning' | undefined
    needConfirm?: boolean | undefined
    disabled?: boolean | undefined
    readOnly?: boolean | undefined
    allowClear?: boolean | undefined
    allowEmpty?: boolean | { start?: boolean; end?: boolean } | undefined
    order?: boolean | undefined
    format?: string | undefined
    weekStartsOn?: CalendarWeekday | undefined
    minDate?: CalendarDate | undefined
    maxDate?: CalendarDate | undefined
    disabledDate?: ((date: CalendarDate, activePart: 'start' | 'end') => boolean) | undefined
    onChange?: ((value: CalendarRange<CalendarValue>) => void) | undefined
    onOpenChange?: ((open: boolean) => void) | undefined
  }
  let props: Props = $props()
  // svelte-ignore state_referenced_locally -- the props proxy remains live inside the controller adapter.
  const picker = useRangePicker<CalendarValue>(props)
  setContext(rangePickerContextKey, picker)
</script>

<Popover open={picker.getOpen()} trigger={['focus', 'click']} placement="bottom" sideOffset={6} onOpenChange={(open) => picker.setOpen(open)}>
  {@render props.children?.()}
</Popover>
