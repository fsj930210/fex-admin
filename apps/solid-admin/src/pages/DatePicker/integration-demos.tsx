import {
  getCalendarToday,
  getCalendarValueDate,
  type CalendarRange,
  type CalendarValue,
} from '@fex/components-core/calendar'
import { formatDatePickerValue } from '@fex/components-core/date-picker/value'
import { endOfDate } from '@fex/components-core/date/utils'
import { datePickerDateTimePanelClassName } from '@fex/components-styles/date-picker'
import {
  DatePickerCancel,
  DatePickerConfirm,
  DatePickerContent,
  DatePickerFooter,
  DatePickerPanel,
  DatePickerPreset,
  DatePickerRoot,
  DatePickerTrigger,
  RangePickerPanelGroup,
  useRangePickerContext,
} from '@fex/components-solid/primitive/date-picker'
import {
  TimePickerHourColumn,
  TimePickerMinuteColumn,
  TimePickerPanel,
  TimePickerRoot,
  TimePickerSecondColumn,
  type TimeValue,
} from '@fex/components-solid/primitive/time-picker'
import { createSignal, For } from 'solid-js'
import { DemoRangePicker, Section } from './shared'

const today = getCalendarToday()

export function IntegrationDemos() {
  const [range, setRange] = createSignal<CalendarRange<CalendarValue>>(lastDays(7))
  const [submitted, setSubmitted] = createSignal<CalendarRange<CalendarValue>>({})
  const [submitCount, setSubmitCount] = createSignal(0)

  return (
    <>
      <Section
        title="预设范围"
        description="预设会直接写入受控范围并保持面板打开，可用于报表、审计和运营筛选。"
      >
        <div>
          <DemoRangePicker value={range()} onChange={setRange}>
            <PresetRangePanel onSelect={setRange} />
          </DemoRangePicker>
        </div>
      </Section>

      <Section
        title="确认后提交"
        description="选择过程只更新面板草稿；点击确认后，才向外部提交范围。"
      >
        <div>
          <DemoRangePicker
            needConfirm
            value={submitted()}
            onChange={setSubmitted}
            footer={
              <DatePickerFooter>
                <DatePickerConfirm onClick={() => setSubmitCount((count) => count + 1)}>
                  确认并提交
                </DatePickerConfirm>
              </DatePickerFooter>
            }
          />
          <p class="mt-space-sm text-xs text-muted-foreground">已提交 {submitCount()} 次</p>
        </div>
      </Section>

      <Section
        title="日期与时间"
        description="DatePicker 与 TimePicker 可分别组合，最终按业务需要一起提交。"
      >
        <DateTimeDemo />
      </Section>
    </>
  )
}

function DateTimeDemo() {
  const [date, setDate] = createSignal<CalendarValue | null>(today)
  const [time, setTime] = createSignal<TimeValue>({ hour: 9, minute: 30, second: 0 })
  const [draftTime, setDraftTime] = createSignal<TimeValue>(time())
  const displayValue = () =>
    `${formatDatePickerValue(date(), { picker: 'date' })} ${formatTime(time())}`.trim()

  return (
    <DatePickerRoot
      needConfirm
      placement="bottom"
      value={date()}
      onChange={(next) => setDate(Array.isArray(next) ? null : (next as CalendarValue | null))}
      onOpenChange={(open) => {
        if (open) setDraftTime(time())
      }}
    >
      <DatePickerTrigger
        class="w-64"
        displayValue={displayValue()}
        placeholder="请选择日期和时间"
      />
      <DatePickerContent class="w-[36rem] min-w-[36rem] overflow-hidden p-0">
        <TimePickerRoot
          open
          value={draftTime()}
          format="HH:mm:ss"
          onChange={(next) => {
            if (next) setDraftTime(next)
          }}
        >
          <div class="flex">
            <DatePickerPanel
              class={`min-w-0 flex-1 self-start ${datePickerDateTimePanelClassName}`}
            />
            <div class="flex w-42 shrink-0 flex-col border-l border-border">
              <div class="flex h-12 shrink-0 items-center justify-center border-b border-border text-sm font-semibold">
                {formatTime(draftTime())}
              </div>
              <TimePickerPanel class="h-[224px] min-h-0 overflow-hidden">
                <TimePickerHourColumn class="h-[224px]" />
                <TimePickerMinuteColumn class="h-[224px]" />
                <TimePickerSecondColumn class="h-[224px]" />
              </TimePickerPanel>
            </div>
          </div>
        </TimePickerRoot>
        <DatePickerFooter>
          <DatePickerCancel onClick={() => setDraftTime(time())}>取消</DatePickerCancel>
          <DatePickerConfirm onClick={() => setTime(draftTime())}>确定</DatePickerConfirm>
        </DatePickerFooter>
      </DatePickerContent>
    </DatePickerRoot>
  )
}

function PresetRangePanel(props: { onSelect: (value: CalendarRange<CalendarValue>) => void }) {
  const rangePicker = useRangePickerContext('PresetRangePanel')
  const presets: Array<[string, CalendarRange<CalendarValue>]> = [
    ['最近 7 天', lastDays(7)],
    ['最近 30 天', lastDays(30)],
    ['本月', thisMonth()],
    ['上月', previousMonth()],
  ]

  return (
    <div class="flex">
      <div class="flex w-32 shrink-0 flex-col gap-1 border-r border-border p-2">
        <For each={presets}>
          {([label, value]) => (
            <DatePickerPreset
              class="justify-start"
              data-selected={isSameRange(rangePicker.rangeValue(), value)}
              onClick={() => {
                props.onSelect(value)
                if (value.start) rangePicker.setViewDate(getCalendarValueDate(value.start))
              }}
            >
              {label}
            </DatePickerPreset>
          )}
        </For>
      </div>
      <RangePickerPanelGroup />
    </div>
  )
}

function lastDays(days: number): CalendarRange<CalendarValue> {
  return { start: today.subtract({ days: days - 1 }), end: today }
}

function thisMonth(): CalendarRange<CalendarValue> {
  return { start: today.with({ day: 1 }), end: endOfDate(today, 'month') }
}

function previousMonth(): CalendarRange<CalendarValue> {
  const end = today.with({ day: 1 }).subtract({ days: 1 })
  return { start: end.with({ day: 1 }), end }
}

function isSameRange(left: CalendarRange<CalendarValue>, right: CalendarRange<CalendarValue>) {
  return getRangeKey(left) === getRangeKey(right)
}

function getRangeKey(value: CalendarRange<CalendarValue>) {
  return `${value.start ? formatDatePickerValue(value.start, { picker: 'date' }) : ''}~${value.end ? formatDatePickerValue(value.end, { picker: 'date' }) : ''}`
}

function formatTime(value: TimeValue): string {
  return `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}:${String(value.second ?? 0).padStart(2, '0')}`
}
