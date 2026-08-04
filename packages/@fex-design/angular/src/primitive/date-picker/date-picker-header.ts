import { ChangeDetectionStrategy, Component, Input, Optional } from '@angular/core'
import {
  getDatePickerHeaderLabelParts,
  getNextPanelByHeaderLabel,
  getNextViewDateByHeaderAction,
} from '@fex-design/core/date-picker/panel'
import type {
  DatePickerHeaderAction,
  DatePickerHeaderLabelPart,
} from '@fex-design/core/date-picker/types'
import {
  datePickerHeaderClassName,
  datePickerHeaderDoubleIconClassName,
  datePickerHeaderLabelClassName,
  datePickerHeaderNavigationClassName,
  datePickerHeaderTitleClassName,
} from '@fex-design/styles/date-picker'
import { ChevronLeftIcon, ChevronRightIcon } from '../../icon/chevron'
import { Button, buttonPrimitiveClassName } from '../button/button'
import { CalendarRoot } from '../calendar/calendar'
import { DatePickerState } from './use-date-picker'
import { RangePickerState } from './use-range-picker'

@Component({
  selector: 'fex-date-picker-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'date-picker-header',
    '[class]': 'className',
  },
  template: '<ng-content />',
})
export class DatePickerHeader {
  protected readonly className = datePickerHeaderClassName
}

@Component({
  selector: 'fex-date-picker-header-title',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'date-picker-header-title',
    '[class]': 'className',
  },
  template: '<ng-content />',
})
export class DatePickerHeaderTitle {
  protected readonly className = datePickerHeaderTitleClassName
}

@Component({
  selector: 'button[fexDatePickerHeaderButton]',
  standalone: true,
  imports: [ChevronLeftIcon, ChevronRightIcon],
  hostDirectives: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'date-picker-header-button',
    '[attr.data-action]': 'action',
    '[class]': 'className',
    '(click)': 'runAction($event)',
  },
  templateUrl: './date-picker-header-button.html',
})
export class DatePickerHeaderButton {
  @Input({ required: true }) action!: DatePickerHeaderAction
  protected readonly className = buttonPrimitiveClassName(datePickerHeaderNavigationClassName)
  protected readonly doubleIconClassName = datePickerHeaderDoubleIconClassName

  constructor(
    private readonly calendar: CalendarRoot,
    @Optional() private readonly datePicker: DatePickerState | null,
    @Optional() private readonly rangePicker: RangePickerState | null,
  ) {}

  isPrevious() {
    return this.action.startsWith('previous')
  }

  isDouble() {
    return this.action.includes('year') || this.action.includes('panel')
  }

  runAction(event: Event) {
    if (event.defaultPrevented) return
    const nextViewDate = getNextViewDateByHeaderAction(
      this.calendar.currentViewDate(),
      this.action,
      this.calendar.currentPanel(),
    )
    this.calendar.setViewDate(nextViewDate)
    this.owner().setViewDate(nextViewDate)
  }

  private owner() {
    const owner = this.datePicker ?? this.rangePicker
    if (!owner)
      throw new Error(
        'DatePickerHeaderButton must be used within DatePickerRoot or RangePickerRoot',
      )
    return owner
  }
}

@Component({
  selector: 'button[fexDatePickerHeaderLabel]',
  standalone: true,
  hostDirectives: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'date-picker-header-label',
    '[attr.data-part]': 'part',
    '[attr.data-hovered]': "hovered ? 'true' : null",
    '[class]': 'className',
    '[style.display]': "visible() ? null : 'none'",
    '(mouseenter)': 'hovered = true',
    '(mouseleave)': 'hovered = false',
    '(click)': 'selectPanel($event)',
  },
  template: '{{ label() }}',
})
export class DatePickerHeaderLabel {
  @Input({ required: true }) part!: DatePickerHeaderLabelPart
  hovered = false
  protected readonly className = buttonPrimitiveClassName(datePickerHeaderLabelClassName)

  constructor(
    private readonly calendar: CalendarRoot,
    @Optional() private readonly datePicker: DatePickerState | null,
    @Optional() private readonly rangePicker: RangePickerState | null,
  ) {}

  visible() {
    return getDatePickerHeaderLabelParts(
      this.owner().context().picker,
      this.calendar.currentPanel(),
    ).includes(this.part)
  }

  label() {
    if (this.part === 'month') return `${this.calendar.currentViewDate().month}月`
    const year = this.calendar.currentViewDate().year
    const decadeStart = Math.floor(year / 10) * 10
    return this.calendar.currentPanel() === 'decade'
      ? `${decadeStart}-${decadeStart + 9}年`
      : `${year}年`
  }

  selectPanel(event: Event) {
    if (event.defaultPrevented) return
    const nextPanel = getNextPanelByHeaderLabel(this.part)
    this.calendar.setPanel(nextPanel)
    this.owner().setPanel(nextPanel)
  }

  private owner() {
    const owner = this.datePicker ?? this.rangePicker
    if (!owner)
      throw new Error('DatePickerHeaderLabel must be used within DatePickerRoot or RangePickerRoot')
    return owner
  }
}
