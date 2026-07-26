# DatePicker

Svelte DatePicker primitive exposes Popover and Calendar composition aliases plus shared core date-picker helpers. Root/Trigger/Content control the floating layer, while Panel/Grid/Cell render calendar values.

## Import

```svelte
<script lang="ts">
  import {
    DatePickerRoot,
    DatePickerTrigger,
    DatePickerContent,
    DatePickerPanel,
    DatePickerGrid,
    DatePickerCell,
  } from '@fex/components-svelte/primitive/date-picker'
</script>
```

Keep submitted values as `CalendarValue`; format for backend payloads at the boundary.
