import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

@Component({
  selector: 'fex-date-picker-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'date-picker-content' },
  template: '<ng-content />',
})
export class DatePickerContent {
  @Input('class') className: string | undefined = undefined
}

@Component({
  selector: 'fex-range-picker-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'range-picker-content' },
  template: '<ng-content />',
})
export class RangePickerContent {
  @Input('class') className: string | undefined = undefined
}
