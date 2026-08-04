# DatePicker

Vue DatePicker is a primitive-only composition surface aligned with React. It does not export a monolithic `DatePicker` or `RangePicker` component.

## Import

```ts
import {
  DatePickerRoot,
  DatePickerTrigger,
  DatePickerContent,
  DatePickerPanel,
  DatePickerHeader,
  DatePickerHeaderButton,
  DatePickerHeaderTitle,
  DatePickerHeaderLabel,
  DatePickerFooter,
  DatePickerConfirm,
  DatePickerCancel,
  DatePickerToday,
  DatePickerPreset,
  DatePickerTags,
  RangePickerRoot,
  RangePickerTrigger,
  RangePickerContent,
  RangePickerPanel,
  RangePickerPanelGroup,
  useDatePicker,
  useRangePicker,
} from '@fex-design/vue/primitive/date-picker'
```

Use Root for state and Popover ownership, Trigger for input display, Content for the floating panel, Header/Panel/PanelGroup for Calendar rendering, and Footer actions for confirmation flows.
