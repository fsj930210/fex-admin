# DatePicker

Svelte DatePicker is a primitive-only composition surface aligned with React. It does not export a monolithic `DatePicker` or `RangePicker` component.

## Import

```svelte
<script lang="ts">
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
  } from '@fex-design/svelte/primitive/date-picker'
</script>
```

Use Root for state and Popover ownership, Trigger for input display, Content for the floating panel, Header/Panel/PanelGroup for Calendar rendering, and Footer actions for confirmation flows.
