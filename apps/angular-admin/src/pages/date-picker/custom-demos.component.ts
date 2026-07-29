import { ChangeDetectionStrategy, Component } from '@angular/core'
import { createCalendarDate, getCalendarValueDate, getCalendarValueKey, type CalendarCell } from '@fex/components-core/calendar'
import { getGranularityByPicker } from '@fex/components-core/date-picker/panel'
import { normalizeDatePickerValue } from '@fex/components-core/date-picker/value'
import { CalendarCellButton, CalendarGrid, CalendarRoot, CalendarWeekHeader } from '@fex/components-angular/primitive/calendar'
import { DatePickerContent, DatePickerFooter, DatePickerPanel, DatePickerRoot, DatePickerState, DatePickerTrigger } from '@fex/components-angular/primitive/date-picker'
import { Card } from '@fex/components-angular/ui/card'
import { Button } from '@fex/components-angular/ui/button'

@Component({
  selector: 'demo-custom-cell-panel',
  standalone: true,
  imports: [CalendarRoot, CalendarWeekHeader, CalendarGrid, CalendarCellButton],
  templateUrl: './custom-cell-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomCellPanel {
  protected readonly releaseDate = createCalendarDate(2026, 7, 30)
  protected readonly getGranularityByPicker = getGranularityByPicker
  protected readonly getCalendarValueKey = getCalendarValueKey
  protected readonly panelClassName = 'block min-w-72 bg-popover text-popover-foreground'
  protected readonly weekHeaderClassName = 'grid grid-cols-7 px-3 py-2 text-center text-xs text-muted-foreground'
  protected readonly gridClassName = 'grid gap-1 p-3 [&>[data-slot=calendar-row]]:grid [&>[data-slot=calendar-row]]:grid-cols-7 [&>[data-slot=calendar-row]]:gap-1'
  protected readonly cellClassName = 'min-h-10 cursor-pointer rounded-md text-sm hover:bg-muted-background data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground'

  constructor(readonly state: DatePickerState) {}

  selectCell(cell: CalendarCell) {
    const context = this.state.context()
    context.select(normalizeDatePickerValue(getCalendarValueDate(cell.value), context.picker, context.weekStartsOn))
  }
}

@Component({
  selector: 'demo-custom-footer',
  standalone: true,
  imports: [DatePickerFooter, Button],
  templateUrl: './custom-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomFooter {
  constructor(readonly state: DatePickerState) {}
}

@Component({
  selector: 'demo-custom-panel',
  standalone: true,
  imports: [Button],
  templateUrl: './custom-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomPanel {
  constructor(readonly state: DatePickerState) {}
}

@Component({
  selector: 'demo-custom-demos',
  standalone: true,
  imports: [Card, DatePickerRoot, DatePickerTrigger, DatePickerContent, DatePickerPanel, CustomCellPanel, CustomFooter, CustomPanel],
  templateUrl: './custom-demos.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomDemos {}
