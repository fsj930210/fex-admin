import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  type AfterViewInit,
  type OnChanges,
} from '@angular/core'
import type { CalendarDate, CalendarValue, CalendarWeekday } from '@fex/components-core/calendar'
import type { DatePickerPicker } from '@fex/components-core/date-picker/types'
import { datePickerContentClassName } from '@fex/components-styles/date-picker'
import { cn } from '@fex/utils'
import { Popover, PopoverContent } from '../popover/popover'
import { DatePickerContent } from './date-picker-content'
import { DatePickerState, type UseDatePickerOptions } from './use-date-picker'
import type { DatePickerSelectionValue } from './context'

@Component({
  selector: 'fex-date-picker-root',
  standalone: true,
  imports: [Popover, PopoverContent],
  providers: [DatePickerState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './date-picker-root.html',
})
export class DatePickerRoot<TValue extends CalendarValue = CalendarValue>
  implements AfterViewInit, OnChanges
{
  @Input() picker: DatePickerPicker | undefined = undefined
  @Input() status: 'error' | 'warning' | undefined = undefined
  @Input() value: DatePickerSelectionValue<TValue> | undefined = undefined
  @Input() defaultValue: DatePickerSelectionValue<TValue> | undefined = undefined
  @Input() open: boolean | undefined = undefined
  @Input() defaultOpen: boolean | undefined = undefined
  @Input() multiple: boolean | undefined = undefined
  @Input() needConfirm: boolean | undefined = undefined
  @Input() disabled: boolean | undefined = undefined
  @Input() readOnly: boolean | undefined = undefined
  @Input() allowClear: boolean | undefined = undefined
  @Input() format: string | undefined = undefined
  @Input() weekStartsOn: CalendarWeekday | undefined = undefined
  @Input() minDate: CalendarDate | undefined = undefined
  @Input() maxDate: CalendarDate | undefined = undefined
  @Input() disabledDate: ((date: CalendarDate) => boolean) | undefined = undefined
  @Output() readonly change = new EventEmitter<DatePickerSelectionValue<TValue>>()
  @Output() readonly openChange = new EventEmitter<boolean>()

  @ViewChild(Popover) private readonly popover?: Popover
  @ContentChild(DatePickerContent) private readonly content?: DatePickerContent
  private pendingTriggerElement?: HTMLElement

  constructor(readonly state: DatePickerState<TValue>) {
    this.state.valueChange.subscribe((value) => this.change.emit(value))
    this.state.openChange.subscribe((open) => this.openChange.emit(open))
  }

  ngOnChanges() {
    this.state.setOptions(this.options())
  }

  ngAfterViewInit() {
    if (this.pendingTriggerElement) this.registerTrigger(this.pendingTriggerElement)
  }

  context() {
    return this.state.context()
  }

  registerTrigger(element: HTMLElement) {
    this.pendingTriggerElement = element
    const popover = this.popover
    if (!popover) return
    popover.referenceElement = element
    popover.overlay.setReferenceElement(element)
  }

  setOpen(open: boolean) {
    this.state.setOpen(open)
  }

  contentClassName() {
    return cn(datePickerContentClassName, this.content?.className)
  }

  private options(): UseDatePickerOptions<TValue> {
    return {
      picker: this.picker,
      status: this.status,
      value: this.value,
      defaultValue: this.defaultValue,
      open: this.open,
      defaultOpen: this.defaultOpen,
      multiple: this.multiple,
      needConfirm: this.needConfirm,
      disabled: this.disabled,
      readOnly: this.readOnly,
      allowClear: this.allowClear,
      format: this.format,
      weekStartsOn: this.weekStartsOn,
      minDate: this.minDate,
      maxDate: this.maxDate,
      disabledDate: this.disabledDate,
    }
  }
}
