# DatePicker

Solid DatePicker primitive reuses Popover for open/floating behavior and Calendar for panel/cell rendering. Shared picker types, formatting, range helpers and constraints live in `@fex/components-core/date-picker/*`.

## Import

```tsx
import {
  DatePickerRoot,
  DatePickerTrigger,
  DatePickerContent,
  DatePickerPanel,
  DatePickerGrid,
  DatePickerCell,
  RangePickerRoot,
} from '@fex/components-solid/primitive/date-picker'
```

`value` is a semantic `CalendarValue`, not a string.
