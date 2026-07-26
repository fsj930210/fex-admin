// The Angular host adapter retains Popover's default padding and max-width in
// its host class. Important utilities keep the picker panel contract intact.
export const datePickerContentClassName = '![--popover-content-max-width:720px] !overflow-hidden !p-0'

export const datePickerTriggerClassName = 'cursor-pointer'

export const datePickerRangeInputClassName = 'relative h-auto min-w-0 flex-1 border-0 bg-transparent shadow-none focus-within:border-0 focus-within:ring-0 data-[active=true]:after:absolute data-[active=true]:after:inset-x-2 data-[active=true]:after:bottom-0 data-[active=true]:after:h-0.5 data-[active=true]:after:bg-primary'

export const datePickerPanelClassName = 'min-w-72 bg-popover text-popover-foreground'

// Keep the two calendar panels at their intrinsic widths. A flex container may
// otherwise shrink the second panel before Floating UI has measured the popup.
export const datePickerPanelsClassName = 'flex w-max divide-x divide-border'

export const datePickerHeaderClassName = 'flex h-12 items-center justify-between border-b border-border px-3'

export const datePickerHeaderNavigationClassName = 'inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-muted-background hover:text-foreground'

export const datePickerHeaderLabelClassName = 'cursor-pointer rounded-md px-1 text-base font-semibold text-foreground transition-colors hover:bg-muted-background data-[hovered=true]:bg-muted-background'

export const datePickerWeekHeaderClassName = 'grid grid-cols-7 px-3 py-2 text-center text-xs text-muted-foreground [&>[data-slot=calendar-week-head]]:py-1'

export const datePickerGridClassName = 'grid gap-1 p-3 [&>[data-slot=calendar-row]]:grid [&>[data-slot=calendar-row]]:gap-1 [&>[data-slot=calendar-row]]:grid-cols-7 data-[panel=month]:[&>[data-slot=calendar-row]]:grid-cols-4 data-[panel=quarter]:[&>[data-slot=calendar-row]]:grid-cols-4 data-[panel=year]:[&>[data-slot=calendar-row]]:grid-cols-4'

export { calendarCellClassName as datePickerCellClassName } from './calendar'

export const datePickerFooterClassName = 'flex justify-end gap-2 border-t border-border px-3 py-2'
