import {
  createCalendarDate,
  getCalendarValueDate,
  type CalendarDate,
  type CalendarRange,
  type CalendarValue,
} from '@fex-design/core/calendar'
import { isAfterDate, isBeforeDate } from '@fex-design/core/date/utils'
import {
  DatePickerCancel,
  DatePickerConfirm,
  DatePickerFooter,
  DatePickerToday,
} from '@fex-design/solid/primitive/date-picker'
import { createSignal } from 'solid-js'
import { DemoDatePicker, DemoRangePicker, RangePreview, Section, ValuePreview } from './shared'

const today = createCalendarDate(2026, 7, 26)
const minDate = createCalendarDate(2026, 7, 8)
const maxDate = createCalendarDate(2026, 8, 20)

export function BasicDemos() {
  const [controlled, setControlled] = createSignal<CalendarValue | null>(today)
  const [multiple, setMultiple] = createSignal<CalendarValue | readonly CalendarValue[] | null>([])
  const [range, setRange] = createSignal<CalendarRange<CalendarValue>>({})
  const [dynamicRange, setDynamicRange] = createSignal<CalendarRange<CalendarValue>>(lastDays(7))
  const dynamicDisabled = (date: CalendarDate, part: 'start' | 'end') => {
    if (part === 'start') {
      const end = dynamicRange().end
      if (!end) return false
      const endDate = getCalendarValueDate(end)
      return isBeforeDate(date, endDate.subtract({ days: 6 })) || isAfterDate(date, endDate)
    }
    const start = dynamicRange().start
    if (!start) return false
    const startDate = getCalendarValueDate(start)
    return isBeforeDate(date, startDate) || isAfterDate(date, startDate.add({ days: 6 }))
  }

  return (
    <>
      <Section title="基本用法" description="非受控 DatePicker 选择后立即提交并关闭 Popover。">
        <DemoDatePicker defaultValue={today} triggerProps={{ placeholder: '请选择日期' }} />
      </Section>
      <Section
        title="受控与非受控"
        description="value/onChange 管理受控值，defaultValue 提供非受控初始值。"
      >
        <div>
          <DemoDatePicker
            value={controlled()}
            onChange={(next) =>
              setControlled(Array.isArray(next) ? null : (next as CalendarValue | null))
            }
          />
          <ValuePreview value={controlled()} />
        </div>
        <DemoDatePicker defaultValue={createCalendarDate(2026, 8, 1)} />
      </Section>
      <Section
        title="禁用日期"
        description="minDate/maxDate 限定固定区间，disabledDate 承载业务规则。"
      >
        <DemoDatePicker minDate={minDate} maxDate={maxDate} />
        <DemoDatePicker
          disabledDate={(date) => isBeforeDate(date, today) || date.dayOfWeek === 6}
        />
        <DemoDatePicker disabled />
      </Section>
      <Section
        title="多选"
        description="multiple 使用 CalendarValue 数组，默认需要确认，不会选中后立刻关闭。"
      >
        <div>
          <DemoDatePicker
            multiple
            value={multiple()}
            onChange={setMultiple}
            footer={
              <DatePickerFooter>
                <DatePickerToday>今天</DatePickerToday>
                <DatePickerCancel>取消</DatePickerCancel>
                <DatePickerConfirm>确定</DatePickerConfirm>
              </DatePickerFooter>
            }
          />
          <ValuePreview value={multiple()} />
        </div>
      </Section>
      <Section
        title="RangePicker"
        description="范围选择使用专门入口，双面板复用 Calendar range state。"
      >
        <div>
          <DemoRangePicker value={range()} onChange={setRange} />
          <RangePreview value={range()} />
        </div>
      </Section>
      <Section
        title="动态范围禁用"
        description="选择一端后通过 disabledDate 限制另一端，只允许 7 天窗口。"
      >
        <div>
          <DemoRangePicker
            value={dynamicRange()}
            onChange={setDynamicRange}
            disabledDate={dynamicDisabled}
          />
          <RangePreview value={dynamicRange()} />
        </div>
      </Section>
    </>
  )
}

function lastDays(days: number): CalendarRange<CalendarValue> {
  return { start: today.subtract({ days: days - 1 }), end: today }
}
