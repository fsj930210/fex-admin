import { tagClassName, tagCloseClassName } from './tag'

// The Angular host adapter retains Popover's default padding and max-width in
// its host class. Important utilities keep the picker panel contract intact.
export const datePickerContentClassName =
  '![--popover-content-max-width:720px] !overflow-hidden !p-0'

export const datePickerTriggerClassName = 'cursor-pointer'

export const datePickerRangeTriggerClassName = 'cursor-pointer gap-0'

export const datePickerRangeInputClassName =
  'relative h-auto min-w-0 flex-1 border-0 bg-transparent shadow-none focus-within:border-0 focus-within:ring-0 data-[active=true]:after:absolute data-[active=true]:after:inset-x-2 data-[active=true]:after:bottom-0 data-[active=true]:after:h-0.5 data-[active=true]:after:bg-primary'

export const datePickerRangeInputControlClassName = 'w-full min-w-0 flex-none px-2 text-left'

export const datePickerRangeSeparatorClassName =
  'inline-flex shrink-0 items-center justify-center px-1 text-muted-foreground'

export const datePickerMultipleTagsClassName =
  'flex min-w-0 max-w-[calc(100%-4rem)] flex-none items-center gap-1 overflow-hidden pl-2'

/** @deprecated Use the Tag primitive. */
export const datePickerTagClassName = tagClassName({ size: 'sm' })
/** @deprecated Use the Tag primitive. */
export const datePickerTagRemoveClassName = tagCloseClassName
/** @deprecated Use the Tag primitive. */
export const datePickerTagOverflowClassName = tagClassName({ size: 'sm' })

export const datePickerMultipleInputClassName = 'w-6 min-w-6 flex-none px-0 caret-foreground'

export const datePickerPanelClassName = 'block min-w-72 bg-popover text-popover-foreground'

export const datePickerDateTimePanelClassName = [
  '[&_[data-slot=calendar-week-header]]:!h-8',
  '[&_[data-slot=calendar-week-header]]:!py-0',
  '[&_[data-slot=calendar-week-head]]:flex',
  '[&_[data-slot=calendar-week-head]]:h-8',
  '[&_[data-slot=calendar-week-head]]:items-center',
  '[&_[data-slot=calendar-week-head]]:justify-center',
  '[&_[data-slot=calendar-week-head]]:!py-0',
  '[&_[data-slot=calendar-grid]]:!px-3',
  '[&_[data-slot=calendar-grid]]:!py-0',
].join(' ')

// Keep the two calendar panels at their intrinsic widths. A flex container may
// otherwise shrink the second panel before Floating UI has measured the popup.
export const datePickerPanelsClassName = 'flex w-max divide-x divide-border'

export const datePickerHeaderClassName =
  'flex h-12 items-center justify-between border-b border-border px-3'

export const datePickerHeaderSideClassName = 'flex items-center gap-1'

export const datePickerHeaderNavigationClassName =
  'inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-muted-background hover:text-foreground'

export const datePickerHeaderDoubleIconClassName = '-ml-2'

export const datePickerHeaderTitleClassName = 'flex items-center gap-2 text-base font-semibold'

export const datePickerHeaderLabelClassName =
  'cursor-pointer rounded-md px-1 !text-base font-semibold text-foreground transition-colors hover:bg-muted-background data-[hovered=true]:bg-muted-background'

export const datePickerWeekHeaderClassName =
  'grid grid-cols-7 px-3 py-2 text-center text-xs text-muted-foreground [&>[data-slot=calendar-week-head]]:py-1'

export const datePickerGridClassName = [
  'grid gap-0 p-3',
  '[&>[data-slot=calendar-row]]:grid [&>[data-slot=calendar-row]]:gap-0',
  'data-[panel=date]:[&>[data-slot=calendar-row]]:grid-cols-7',
  'data-[panel=month]:min-h-48 data-[panel=month]:grid-rows-3 data-[panel=month]:[&>[data-slot=calendar-row]]:grid-cols-4',
  'data-[panel=quarter]:py-4 data-[panel=quarter]:[&>[data-slot=calendar-row]]:grid-cols-4',
  'data-[panel=year]:min-h-48 data-[panel=year]:grid-rows-3 data-[panel=year]:[&>[data-slot=calendar-row]]:grid-cols-4',
  'data-[panel=decade]:min-h-48 data-[panel=decade]:grid-rows-3 data-[panel=decade]:[&>[data-slot=calendar-row]]:grid-cols-4',
  'data-[panel=month]:[&>[data-slot=calendar-row]]:items-center data-[panel=quarter]:[&>[data-slot=calendar-row]]:items-center data-[panel=year]:[&>[data-slot=calendar-row]]:items-center data-[panel=decade]:[&>[data-slot=calendar-row]]:items-center',
  'data-[panel=month]:[&_[data-slot=calendar-cell]]:h-10 data-[panel=quarter]:[&_[data-slot=calendar-cell]]:h-10 data-[panel=year]:[&_[data-slot=calendar-cell]]:h-10 data-[panel=decade]:[&_[data-slot=calendar-cell]]:h-10',
].join(' ')

export { calendarCellClassName as datePickerCellClassName } from './calendar'

export const datePickerFooterClassName =
  'flex items-center justify-end gap-2 border-t border-border p-2'

export const datePickerConfirmClassName =
  'rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground'

export const datePickerCancelClassName = 'rounded-md border border-border px-3 py-1 text-sm'

export const datePickerTodayClassName =
  'rounded-md px-2 py-1 text-sm text-primary hover:bg-muted-background'

export const datePickerPresetClassName = `${datePickerTodayClassName} data-[selected=true]:bg-muted-background data-[selected=true]:font-medium data-[selected=true]:text-foreground`
