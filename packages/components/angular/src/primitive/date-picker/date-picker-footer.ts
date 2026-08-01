import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { getCalendarToday } from '@fex/components-core/calendar'
import { getDefaultPanelByPicker } from '@fex/components-core/date-picker/panel'
import {
  datePickerCancelClassName,
  datePickerConfirmClassName,
  datePickerFooterClassName,
  datePickerPresetClassName,
  datePickerTodayClassName,
} from '@fex/components-styles/date-picker'
import { cn } from '@fex/utils'
import { createHostClassName } from '../../signals/host-class'
import { Button, buttonPrimitiveClassName } from '../button/button'
import { DatePickerState } from './use-date-picker'
import { RangePickerState } from './use-range-picker'

@Component({
  selector: 'fex-date-picker-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'date-picker-footer',
    '[class]': 'className',
  },
  template: '<ng-content />',
})
export class DatePickerFooter {
  protected readonly className = datePickerFooterClassName
}

abstract class DatePickerFooterAction {
  protected readonly datePicker = inject(DatePickerState, { optional: true })
  protected readonly rangePicker = inject(RangePickerState, { optional: true })

  protected owner() {
    const owner = this.datePicker ?? this.rangePicker
    if (!owner)
      throw new Error(
        'DatePicker footer actions must be used within DatePickerRoot or RangePickerRoot',
      )
    return owner
  }
}

@Component({
  selector: 'button[fexDatePickerConfirm]',
  standalone: true,
  hostDirectives: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'date-picker-confirm',
    '[class]': 'className()',
    '(click)': 'owner().confirm()',
  },
  template: '<ng-content>确定</ng-content>',
})
export class DatePickerConfirm extends DatePickerFooterAction {
  protected readonly className = createHostClassName(() =>
    cn(buttonPrimitiveClassName(), datePickerConfirmClassName),
  )
}

@Component({
  selector: 'button[fexDatePickerCancel]',
  standalone: true,
  hostDirectives: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'date-picker-cancel',
    '[class]': 'className()',
    '(click)': 'owner().cancel()',
  },
  template: '<ng-content>取消</ng-content>',
})
export class DatePickerCancel extends DatePickerFooterAction {
  protected readonly className = createHostClassName(() =>
    cn(buttonPrimitiveClassName(), datePickerCancelClassName),
  )
}

@Component({
  selector: 'button[fexDatePickerToday]',
  standalone: true,
  hostDirectives: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'date-picker-today', '[class]': 'className()', '(click)': 'today()' },
  template: '<ng-content>今天</ng-content>',
})
export class DatePickerToday extends DatePickerFooterAction {
  protected readonly className = createHostClassName(() =>
    cn(buttonPrimitiveClassName(), datePickerTodayClassName),
  )

  today() {
    const owner = this.owner()
    owner.setViewDate(getCalendarToday())
    owner.setPanel(getDefaultPanelByPicker(owner.context().picker))
  }
}

@Component({
  selector: 'button[fexDatePickerPreset]',
  standalone: true,
  hostDirectives: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'date-picker-preset', '[class]': 'className()' },
  template: '<ng-content />',
})
export class DatePickerPreset {
  protected readonly className = createHostClassName(() =>
    cn(buttonPrimitiveClassName(), datePickerPresetClassName),
  )
}
