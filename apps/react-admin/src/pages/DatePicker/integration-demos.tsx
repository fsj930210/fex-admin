import {
  getCalendarToday,
  type CalendarRange,
  type CalendarValue,
} from '@fex/components-core/calendar'
import { formatDatePickerValue } from '@fex/components-core/date-picker/value'
import {
  DatePickerConfirm,
  DatePickerContent,
  DatePickerContext,
  DatePickerFooter,
  DatePickerPanel,
  DatePickerPreset,
  RangePickerPanelGroup,
  useRangePickerContext,
  useDatePicker,
} from '@fex/components-react/primitive/date-picker'
import { InputControl, InputRoot, InputSuffix } from '@fex/components-react/primitive/input'
import { PopoverRoot, PopoverTrigger } from '@fex/components-react/primitive/popover'
import {
  TimePickerContext,
  TimePickerHourColumn,
  TimePickerMinuteColumn,
  TimePickerPanel,
  useTimePicker,
  type TimeValue,
} from '@fex/components-react/primitive/time-picker'
import { CalendarIcon } from '@fex/components-react/icon/calendar'
import { Button } from '@fex/components-react/ui/button'
import { useState, type ComponentProps } from 'react'
import { DemoDatePicker, DemoRangePicker, DemoSection, RangePreview } from './shared'

const today = getCalendarToday()

export function IntegrationDemos() {
  return (
    <>
      <DemoSection title="预设范围" description="预设会直接写入受控范围并保持面板打开，可用于报表、审计和运营筛选。">
        <PresetRangeDemo />
      </DemoSection>

      <DemoSection title="确认后提交" description="选择过程只更新面板草稿；点击确认并提交后，才向外部提交范围。">
        <DeferredRangeDemo />
      </DemoSection>

      <DemoSection title="日期与时间" description="DatePicker 与 TimePicker 可以分别组合，最终按业务需要一起提交。">
        <DateTimeDemo />
      </DemoSection>
    </>
  )
}

function PresetRangeDemo() {
  const [value, setValue] = useState<CalendarRange>(lastDays(7))

  return (
    <div>
      <DemoRangePicker value={value} onChange={setValue}>
        <PresetRangePanel onSelect={setValue} />
      </DemoRangePicker>
      <RangePreview value={value} />
    </div>
  )
}

function PresetRangePanel({ onSelect }: { onSelect: (value: CalendarRange) => void }) {
  const rangePicker = useRangePickerContext('PresetRangePanel')
  const presets: Array<[string, CalendarRange]> = [
    ['最近 7 天', lastDays(7)],
    ['最近 30 天', lastDays(30)],
    ['本月', { start: today.with({ day: 1 }), end: today }],
    ['上月', previousMonth()],
  ]

  return (
    <div className="flex">
      <div className="flex w-32 shrink-0 flex-col gap-1 border-r border-border p-2">
        {presets.map(([label, value]) => (
          <DatePickerPreset
            key={label}
            className="justify-start"
            onClick={() => {
              onSelect(value)
              if (value.start) rangePicker.setViewDate(value.start)
            }}
          >
            {label}
          </DatePickerPreset>
        ))}
      </div>
      <RangePickerPanelGroup />
    </div>
  )
}

function DeferredRangeDemo() {
  const [submittedValue, setSubmittedValue] = useState<CalendarRange>({})
  const [submitCount, setSubmitCount] = useState(0)

  return (
    <div>
      <DemoRangePicker
        needConfirm
        onChange={setSubmittedValue}
        footer={
          <DatePickerFooter>
            <DatePickerConfirm onClick={() => setSubmitCount((count) => count + 1)}>
              确认并提交
            </DatePickerConfirm>
          </DatePickerFooter>
        }
      />
      <RangePreview value={submittedValue} />
      <p className="mt-space-sm text-xs text-muted-foreground">已提交 {submitCount} 次</p>
    </div>
  )
}

function DateTimeDemo() {
  const [date, setDate] = useState<CalendarValue | null>(today)
  const [time, setTime] = useState<TimeValue>({ hour: 9, minute: 30, second: 0 })
  const [draftTime, setDraftTime] = useState<TimeValue>(time)
  const datePicker = useDatePicker<CalendarValue>({ value: date, onChange: setDate, needConfirm: true })
  const timePicker = useTimePicker({ value: draftTime, onChange: (value) => value && setDraftTime(value) })
  const displayValue = `${formatDatePickerValue(date, { picker: 'date' })} ${formatTime(time)}`

  function setOpen(open: boolean) {
    if (open && !datePicker.open) setDraftTime(time)
    datePicker.setOpen(open)
  }

  return (
    <PopoverRoot open={datePicker.open} onOpenChange={setOpen} placement="bottomLeft" trigger={['focus', 'click']}>
      <DatePickerContext value={datePicker}>
        <TimePickerContext value={{ ...timePicker, format: 'HH:mm', use12Hours: false, disabled: false, readOnly: false }}>
          <PopoverTrigger>
            {(triggerProps) => (
              <InputRoot
                {...(triggerProps as ComponentProps<typeof InputRoot>)}
                value={displayValue.trim()}
                readOnly
                className="w-64 cursor-pointer"
                onValueChange={() => undefined}
              >
                <InputControl readOnly placeholder="请选择日期和时间" />
                <InputSuffix><CalendarIcon className="size-4" /></InputSuffix>
              </InputRoot>
            )}
          </PopoverTrigger>
          <DatePickerContent
            className="overflow-hidden p-0"
            style={{ width: '34rem', minWidth: '34rem' }}
          >
            <div className="flex">
              <DatePickerPanel className="min-w-0 flex-1" />
              <div className="flex w-40 shrink-0 flex-col border-l border-border">
                <div aria-hidden="true" className="h-12 shrink-0 border-b border-border" />
                <TimePickerPanel className="h-80 min-h-0 overflow-hidden">
                  <TimePickerHourColumn className="h-full" />
                  <TimePickerMinuteColumn className="h-full" />
                </TimePickerPanel>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-border p-2">
              <Button size="sm" variant="outline" onClick={() => {
                setDraftTime(time)
                datePicker.cancel()
              }}>
                取消
              </Button>
              <Button size="sm" onClick={() => {
                setTime(draftTime)
                datePicker.confirm()
              }}>
                确定
              </Button>
            </div>
          </DatePickerContent>
        </TimePickerContext>
      </DatePickerContext>
    </PopoverRoot>
  )
}

function formatTime(value: TimeValue): string {
  return `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}`
}

function lastDays(days: number): CalendarRange<CalendarDate> {
  return { start: today.subtract({ days: days - 1 }), end: today }
}

function previousMonth(): CalendarRange<CalendarDate> {
  const end = today.with({ day: 1 }).subtract({ days: 1 })
  return { start: end.with({ day: 1 }), end }
}
