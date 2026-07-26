# DatePicker

Vue DatePicker primitive exposes the same composition surface as the React implementation: Root/Trigger/Content come from Popover, Panel/Grid/Cell come from Calendar, and date value helpers come from `@fex/components-core/date-picker/*`.

## Import

```ts
import {
  DatePickerRoot,
  DatePickerTrigger,
  DatePickerContent,
  DatePickerPanel,
  DatePickerGrid,
  DatePickerCell,
  RangePickerRoot,
} from '@fex/components-vue/primitive/date-picker'
```

## Notes

`value` should stay as `CalendarValue`; input text is only display state. Use `formatDatePickerValue` and `parseDatePickerValue` to convert between text and semantic calendar values.
