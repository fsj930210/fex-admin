import {
  createCalendarDate,
  getCalendarValueKey,
  type CalendarValue,
} from '@fex/components-core/calendar'
import { Button } from '@fex/components-solid/ui/button'
import { createSignal } from 'solid-js'
import { DemoDatePicker, DemoRangePicker, Section } from './shared'

const initial = createCalendarDate(2026, 7, 26)

export function PickerDemos() {
  const [open, setOpen] = createSignal(false)
  const [panelValue, setPanelValue] = createSignal<CalendarValue | null>(null)
  return (
    <>
      <Section
        title="Picker 面板"
        description="picker 覆盖 date/week/month/quarter/year 五种日期粒度。"
      >
        <DemoDatePicker
          picker="date"
          defaultValue={initial}
          triggerProps={{ placeholder: '请选择日期' }}
        />
        <DemoDatePicker picker="week" triggerProps={{ placeholder: '请选择周' }} />
        <DemoDatePicker picker="month" triggerProps={{ placeholder: '请选择月份' }} />
        <DemoDatePicker picker="quarter" triggerProps={{ placeholder: '请选择季度' }} />
        <DemoDatePicker picker="year" triggerProps={{ placeholder: '请选择年份' }} />
      </Section>
      <Section
        title="格式化"
        description="format 只影响输入与展示；value/onChange 仍然保持 Temporal CalendarValue。"
      >
        <DemoDatePicker format="YYYY/MM/DD" triggerProps={{ placeholder: 'YYYY/MM/DD' }} />
        <DemoDatePicker picker="month" format="YYYY/MM" triggerProps={{ placeholder: 'YYYY/MM' }} />
      </Section>
      <Section
        title="Range Picker 类型"
        description="范围选择同样支持 year/month/date/week/quarter。"
      >
        <DemoRangePicker
          picker="date"
          triggerProps={{ startPlaceholder: '开始日期', endPlaceholder: '结束日期' }}
        />
        <DemoRangePicker
          picker="week"
          triggerProps={{ startPlaceholder: '开始周', endPlaceholder: '结束周' }}
        />
        <DemoRangePicker
          picker="month"
          triggerProps={{ startPlaceholder: '开始月份', endPlaceholder: '结束月份' }}
        />
        <DemoRangePicker
          picker="quarter"
          triggerProps={{ startPlaceholder: '开始季度', endPlaceholder: '结束季度' }}
        />
        <DemoRangePicker
          picker="year"
          triggerProps={{ startPlaceholder: '开始年份', endPlaceholder: '结束年份' }}
        />
      </Section>
      <Section
        title="切换日期和面板"
        description="受控 open 展示 Popover；Header 的单箭头切月、双箭头切年，年/月标签可切换面板。"
      >
        <div class="space-y-space-sm">
          <div class="flex gap-space-sm">
            <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
              打开面板
            </Button>
            <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
              关闭面板
            </Button>
          </div>
          <DemoDatePicker
            open={open()}
            onOpenChange={setOpen}
            value={panelValue()}
            onChange={(next) =>
              setPanelValue(Array.isArray(next) ? null : (next as CalendarValue | null))
            }
          />
          <p class="text-xs text-muted-foreground">
            当前选择：{panelValue() ? getCalendarValueKey(panelValue()!) : '未选择'}
          </p>
        </div>
      </Section>
      <Section title="允许留空" description="RangePicker 可允许清空某一端，适合“至今”等场景。">
        <DemoRangePicker
          allowEmpty={{ end: true }}
          triggerProps={{ startPlaceholder: 'Start Date', endPlaceholder: 'Till Now' }}
        />
      </Section>
    </>
  )
}
