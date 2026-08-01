import {
  getCalendarToday,
  type CalendarDate,
  type CalendarRange,
} from '@fex/components-core/calendar'
import { formatDatePickerValue } from '@fex/components-core/date-picker/value'
import { endOfDate } from '@fex/components-core/date/utils'
import { datePickerDateTimePanelClassName } from '@fex/components-styles/date-picker'
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
  TimePickerSecondColumn,
  useTimePicker,
  type TimeValue,
} from '@fex/components-react/primitive/time-picker'
import { CalendarIcon } from '@fex/components-react/icon/calendar'
import { Button } from '@fex/components-react/ui/button'
import { useState, type ComponentProps, type ContextType } from 'react'
import { DemoRangePicker, DemoSection, RangePreview } from './shared'

const today = getCalendarToday()

export function IntegrationDemos() {
  return (
    <>
      <DemoSection
        title="预设范围"
        description="预设会直接写入受控范围并保持面板打开，可用于报表、审计和运营筛选。"
      >
        <PresetRangeDemo />
      </DemoSection>

      <DemoSection
        title="确认后提交"
        description="选择过程只更新面板草稿；点击确认并提交后，才向外部提交范围。"
      >
        <DeferredRangeDemo />
      </DemoSection>

      <DemoSection
        title="日期与时间"
        description="DatePicker 与 TimePicker 可以分别组合，最终按业务需要一起提交。"
      >
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
    ['本月', thisMonth()],
    ['上月', previousMonth()],
  ]

  return (
    <div className="flex">
      <div className="flex w-32 shrink-0 flex-col gap-1 border-r border-border p-2">
        {presets.map(([label, value]) => (
          <DatePickerPreset
            key={label}
            className="justify-start"
            data-selected={isSameRange(rangePicker.rangeValue, value)}
            onClick={() => {
              onSelect(value)
              if (value.start) rangePicker.setViewDate(value.start as CalendarDate)
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
  const [date, setDate] = useState<CalendarDate | null>(today)
  const [time, setTime] = useState<TimeValue>({ hour: 9, minute: 30, second: 0 })
  const [draftTime, setDraftTime] = useState<TimeValue>(time)
  const datePicker = useDatePicker<CalendarDate>({
    value: date,
    onChange: (next) => {
      if (!Array.isArray(next)) setDate(next as CalendarDate | null)
    },
    needConfirm: true,
  })
  const timePicker = useTimePicker({
    value: draftTime,
    onChange: (value) => value && setDraftTime(value),
  })
  const displayValue = `${formatDatePickerValue(date, { picker: 'date' })} ${formatTime(time)}`

  function setOpen(open: boolean) {
    if (open && !datePicker.open) setDraftTime(time)
    datePicker.setOpen(open)
  }

  return (
    <PopoverRoot
      open={datePicker.open}
      onOpenChange={setOpen}
      placement="bottom"
      trigger={['focus', 'click']}
    >
      <DatePickerContext value={datePicker as unknown as ContextType<typeof DatePickerContext>}>
        <TimePickerContext
          value={{
            ...timePicker,
            format: 'HH:mm:ss',
            use12Hours: false,
            disabled: false,
            readOnly: false,
          }}
        >
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
                <InputSuffix>
                  <CalendarIcon className="size-4" />
                </InputSuffix>
              </InputRoot>
            )}
          </PopoverTrigger>
          <DatePickerContent className="w-[36rem] min-w-[36rem] overflow-hidden p-0">
            <div className="flex">
              <DatePickerPanel
                className={`min-w-0 flex-1 self-start ${datePickerDateTimePanelClassName}`}
              />
              <div className="flex w-42 shrink-0 flex-col border-l border-border">
                <div className="flex h-12 shrink-0 items-center justify-center border-b border-border text-sm font-semibold">
                  {formatTime(draftTime)}
                </div>
                <TimePickerPanel className="h-[224px] min-h-0 overflow-hidden">
                  <TimePickerHourColumn className="h-[224px]" />
                  <TimePickerMinuteColumn className="h-[224px]" />
                  <TimePickerSecondColumn className="h-[224px]" />
                </TimePickerPanel>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-border p-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setDraftTime(time)
                  datePicker.cancel()
                }}
              >
                取消
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setTime(draftTime)
                  datePicker.confirm()
                }}
              >
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
  return `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}:${String(value.second ?? 0).padStart(2, '0')}`
}

function lastDays(days: number): CalendarRange<CalendarDate> {
  return { start: today.subtract({ days: days - 1 }), end: today }
}

function thisMonth(): CalendarRange<CalendarDate> {
  return { start: today.with({ day: 1 }), end: endOfDate(today, 'month') }
}

function previousMonth(): CalendarRange<CalendarDate> {
  const end = today.with({ day: 1 }).subtract({ days: 1 })
  return { start: end.with({ day: 1 }), end }
}

function isSameRange(left: CalendarRange, right: CalendarRange) {
  return getRangeKey(left) === getRangeKey(right)
}

function getRangeKey(value: CalendarRange) {
  return `${value.start ? formatDatePickerValue(value.start, { picker: 'date' }) : ''}~${value.end ? formatDatePickerValue(value.end, { picker: 'date' }) : ''}`
}
