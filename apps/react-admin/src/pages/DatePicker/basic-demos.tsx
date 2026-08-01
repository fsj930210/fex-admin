import {
  createCalendarDate,
  getCalendarValueDate,
  type CalendarRange,
  type CalendarValue,
} from '@fex/components-core/calendar'
import { isAfterDate, isBeforeDate } from '@fex/components-core/date/utils'
import { CalendarIcon } from '@fex/components-react/icon/calendar'
import { useState } from 'react'
import {
  ConfirmFooter,
  DemoDatePicker,
  DemoRangePicker,
  DemoSection,
  RangePreview,
  ValuePreview,
} from './shared'

const today = createCalendarDate(2026, 7, 26)
const minDate = createCalendarDate(2026, 7, 8)
const maxDate = createCalendarDate(2026, 8, 20)

export function BasicDemos() {
  const [controlled, setControlled] = useState<CalendarValue | null>(today)
  const [range, setRange] = useState<CalendarRange>({})
  const [dynamicRange, setDynamicRange] = useState<CalendarRange>(lastDays(7))
  const [multiple, setMultiple] = useState<CalendarValue | readonly CalendarValue[] | null>([])

  return (
    <>
      <DemoSection title="基本用法" description="非受控 DatePicker 选择后立即提交并关闭 Popover。">
        <DemoDatePicker defaultValue={today} triggerProps={{ placeholder: '请选择日期' }} />
      </DemoSection>

      <DemoSection
        title="受控与非受控"
        description="value/onChange 管理受控值，defaultValue 提供非受控初始值。"
      >
        <div>
          <DemoDatePicker
            value={controlled}
            onChange={(next) => setControlled(isValueArray(next) ? null : next)}
          />
          <ValuePreview value={controlled} />
        </div>
        <DemoDatePicker defaultValue={createCalendarDate(2026, 8, 1)} />
      </DemoSection>

      <DemoSection
        title="禁用日期"
        description="minDate/maxDate 限定固定区间，disabledDate 承载业务规则。"
      >
        <DemoDatePicker minDate={minDate} maxDate={maxDate} />
        <DemoDatePicker
          disabledDate={(date) => isBeforeDate(date, today) || date.dayOfWeek === 6}
        />
        <DemoDatePicker disabled />
      </DemoSection>

      <DemoSection
        title="多选"
        description="multiple 使用 CalendarValue 数组，默认需要确认，不会选中后立刻关闭。"
      >
        <div>
          <DemoDatePicker
            multiple
            value={multiple}
            onChange={setMultiple}
            footer={<ConfirmFooter />}
          />
          <ValuePreview value={multiple} />
        </div>
      </DemoSection>

      <DemoSection
        title="RangePicker"
        description="范围选择使用专门入口，双面板复用 Calendar range state。"
      >
        <div>
          <DemoRangePicker value={range} onChange={setRange} />
          <RangePreview value={range} />
        </div>
      </DemoSection>

      <DemoSection
        title="动态范围禁用"
        description="选择一端后通过 disabledDate 限制另一端，只允许 7 天窗口。"
      >
        <div>
          <DemoRangePicker
            disabledDate={(date, part) => {
              if (part === 'start') {
                if (!dynamicRange.end) return false
                const endDate = getCalendarValueDate(dynamicRange.end)
                return (
                  isBeforeDate(date, endDate.subtract({ days: 6 })) || isAfterDate(date, endDate)
                )
              }
              if (!dynamicRange.start) return false
              const startDate = getCalendarValueDate(dynamicRange.start)
              return isBeforeDate(date, startDate) || isAfterDate(date, startDate.add({ days: 6 }))
            }}
            value={dynamicRange}
            onChange={setDynamicRange}
          />
          <RangePreview value={dynamicRange} />
        </div>
      </DemoSection>

      <DemoSection
        title="Prefix / Suffix"
        description="输入框复用 Input 能力，clear 和 suffix 互斥显示。"
      >
        <DemoDatePicker
          triggerProps={{
            prefix: <span className="text-xs text-muted-foreground">开始</span>,
            suffix: <CalendarIcon className="size-4 text-primary" />,
          }}
        />
        <DemoDatePicker
          allowClear={false}
          triggerProps={{ suffix: <span className="text-xs">自定义</span> }}
        />
      </DemoSection>
    </>
  )
}

function isValueArray(value: unknown): value is readonly CalendarValue[] {
  return Array.isArray(value)
}

function lastDays(days: number): CalendarRange<CalendarValue> {
  return { start: today.subtract({ days: days - 1 }), end: today }
}
