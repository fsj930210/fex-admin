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
import type {
  CalendarDate,
  CalendarRange,
  CalendarValue,
  CalendarWeekday,
} from '@fex/components-core/calendar'
import type { DatePickerPicker } from '@fex/components-core/date-picker/types'
import { datePickerContentClassName } from '@fex/components-styles/date-picker'
import { cn } from '@fex/utils'
import { Popover, PopoverContent, PopoverPortal } from '../popover/popover'
import { RangePickerContent } from './date-picker-content'
import { RangePickerState, type UseRangePickerOptions } from './use-range-picker'

@Component({
  selector: 'fex-range-picker-root',
  standalone: true,
  imports: [Popover, PopoverPortal, PopoverContent],
  providers: [RangePickerState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './range-picker-root.html',
})
export class RangePickerRoot<TValue extends CalendarValue = CalendarValue>
  implements AfterViewInit, OnChanges
{
  @Input() picker: DatePickerPicker | undefined = undefined
  @Input() status: 'error' | 'warning' | undefined = undefined
  @Input() value: CalendarRange<TValue> | undefined = undefined
  @Input() defaultValue: CalendarRange<TValue> | undefined = undefined
  @Input() open: boolean | undefined = undefined
  @Input() defaultOpen: boolean | undefined = undefined
  @Input() needConfirm: boolean | undefined = undefined
  @Input() disabled: boolean | undefined = undefined
  @Input() readOnly: boolean | undefined = undefined
  @Input() allowClear: boolean | undefined = undefined
  @Input() allowEmpty: boolean | { start?: boolean; end?: boolean } | undefined = undefined
  @Input() order: boolean | undefined = undefined
  @Input() format: string | undefined = undefined
  @Input() weekStartsOn: CalendarWeekday | undefined = undefined
  @Input() minDate: CalendarDate | undefined = undefined
  @Input() maxDate: CalendarDate | undefined = undefined
  @Input() disabledDate:
    | ((date: CalendarDate, activePart: 'start' | 'end') => boolean)
    | undefined = undefined
  @Output() readonly change = new EventEmitter<CalendarRange<TValue>>()
  @Output() readonly openChange = new EventEmitter<boolean>()

  @ViewChild(Popover) private readonly popover?: Popover
  @ContentChild(RangePickerContent) private readonly content?: RangePickerContent
  private pendingTriggerElement?: HTMLElement

  constructor(readonly state: RangePickerState<TValue>) {
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

  private options(): UseRangePickerOptions<TValue> {
    return {
      picker: this.picker,
      status: this.status,
      value: this.value,
      defaultValue: this.defaultValue,
      open: this.open,
      defaultOpen: this.defaultOpen,
      needConfirm: this.needConfirm,
      disabled: this.disabled,
      readOnly: this.readOnly,
      allowClear: this.allowClear,
      allowEmpty: this.allowEmpty,
      order: this.order,
      format: this.format,
      weekStartsOn: this.weekStartsOn,
      minDate: this.minDate,
      maxDate: this.maxDate,
      disabledDate: this.disabledDate,
    }
  }
}
