import { analyzeTimeFormat } from '@fex/components-core/date/utils'
import { TimePickerContent, TimePickerHourColumn, TimePickerMinuteColumn, TimePickerPanel, TimePickerPeriodColumn, TimePickerPrefixTemplate, TimePickerRoot, TimePickerSecondColumn, TimePickerSuffixTemplate, TimePickerTrigger, type DisabledTime, type TimeValue } from '@fex/components-angular/primitive/time-picker'
import { CalendarIcon } from '@fex/components-angular/icon/calendar'
import { Button } from '@fex/components-angular/ui/button'
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core'

@Component({ selector: 'fex-demo-time-picker', standalone: true, imports: [TimePickerRoot, TimePickerTrigger, TimePickerContent, TimePickerPanel, TimePickerPrefixTemplate, TimePickerSuffixTemplate, TimePickerHourColumn, TimePickerMinuteColumn, TimePickerSecondColumn, TimePickerPeriodColumn, CalendarIcon, Button], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './demo-time-picker.component.html' })
export class DemoTimePickerComponent {
  value = input<TimeValue | null | undefined>()
  defaultValue = input<TimeValue | null>(null)
  use12Hours = input(false)
  format = input<string | undefined>()
  step = input<{ hour?: number; minute?: number; second?: number } | undefined>()
  disabledTime = input<DisabledTime | undefined>()
  disabled = input(false)
  invalid = input(false)
  prefix = input<string | undefined>()
  calendarSuffix = input(false)
  panelExtra = input(false)
  change = output<TimeValue | null>()
  protected readonly open = signal(false)
  protected readonly pattern = computed(() => this.format() ?? (this.use12Hours() ? 'hh:mm:ss A' : 'HH:mm:ss'))
  protected readonly columns = computed(() => analyzeTimeFormat(this.pattern(), this.use12Hours()).columns)
}
