import { A } from '@solidjs/router'
import { createCalendarDate, getCalendarValueDate, getCalendarValueKey, type CalendarRange, type CalendarValue } from '@fex/components-core/calendar'
import { isAfterDate, isBeforeDate } from '@fex/components-core/date/utils'
import { DatePicker, RangePicker } from '@fex/components-solid/primitive/date-picker'
import { TimePickerContent, TimePickerHourColumn, TimePickerMinuteColumn, TimePickerPanel, TimePickerRoot, TimePickerTrigger } from '@fex/components-solid/primitive/time-picker'
import { Button } from '@fex/components-solid/ui/button'
import Card from '@fex/components-solid/ui/card'
import { createSignal, type JSX } from 'solid-js'

const today = createCalendarDate(2026, 7, 26)
const minDate = createCalendarDate(2026, 7, 8)
const maxDate = createCalendarDate(2026, 8, 20)
const lastDays = (days: number): CalendarRange<CalendarValue> => ({ start: today.subtract({ days: days - 1 }), end: today })
function Section(props: { title: string; description: string; children: JSX.Element }) { return <Card title={props.title} description={props.description}><div class="flex min-w-0 flex-wrap items-start gap-space-md">{props.children}</div></Card> }
function displayRange(value: CalendarRange<CalendarValue>) { return value.start && value.end ? getCalendarValueKey(value.start) + ' ~ ' + getCalendarValueKey(value.end) : '空 ~ 空' }

export function DatePickerPage() {
  const [controlled, setControlled] = createSignal<CalendarValue | null>(today)
  const [multiple, setMultiple] = createSignal<CalendarValue | readonly CalendarValue[] | null>([])
  const [range, setRange] = createSignal<CalendarRange<CalendarValue>>({})
  const [submitted, setSubmitted] = createSignal<CalendarRange<CalendarValue>>({})
  const [panelValue, setPanelValue] = createSignal<CalendarValue | null>(null)
  const [open, setOpen] = createSignal(false)
  const [submitCount, setSubmitCount] = createSignal(0)
  const setDate = (next: CalendarValue | readonly CalendarValue[] | null, setter: (value: CalendarValue | null) => void) => setter(Array.isArray(next) ? null : next)
  const dynamicDisabled = (date: CalendarValue, part: 'start' | 'end') => {
    const from = part === 'end' ? range().start : range().end
    return Boolean(from && (isBeforeDate(date, getCalendarValueDate(from).subtract({ days: 6 })) || isAfterDate(date, getCalendarValueDate(from).add({ days: 6 }))))
  }

  return <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl">
    <header class="space-y-space-xl"><A class="text-sm text-muted-foreground hover:text-foreground" href="/">返回首页</A><div><h1 class="text-2xl font-semibold text-foreground">DatePicker</h1><p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">DatePicker primitive 组合 Input、Popover 和 Calendar，示例覆盖单选、多选、范围、禁用、面板切换和自定义渲染。</p></div></header>
    <div class="space-y-space-xl">
      <Section title="基本用法" description="非受控 DatePicker 选择后立即提交并关闭 Popover。"><DatePicker class="w-56" defaultValue={today} placeholder="请选择日期" /></Section>
      <Section title="受控与非受控" description="value/onChange 管理受控值，defaultValue 提供非受控初始值。"><div><DatePicker value={controlled()} onChange={next => setDate(next, setControlled)} /><p class="mt-space-sm text-xs text-muted-foreground">当前值：{controlled() ? getCalendarValueKey(controlled()!) : '未选择'}</p></div><DatePicker defaultValue={createCalendarDate(2026, 8, 1)} /></Section>
      <Section title="禁用日期" description="minDate/maxDate 限定固定区间，disabledDate 承载业务规则。"><DatePicker minDate={minDate} maxDate={maxDate} /><DatePicker disabledDate={date => isBeforeDate(date, today) || date.dayOfWeek === 6} /><DatePicker disabled /></Section>
      <Section title="多选" description="multiple 使用 CalendarValue 数组，默认需要确认，不会选中后立刻关闭。"><div><DatePicker multiple value={multiple()} onChange={setMultiple} /><p class="mt-space-sm text-xs text-muted-foreground">当前值：{Array.isArray(multiple()) ? multiple().map(getCalendarValueKey).join(', ') || '未选择' : '未选择'}</p></div></Section>
      <Section title="RangePicker" description="范围选择使用专门入口，双面板复用 Calendar range state。"><div><RangePicker value={range()} onChange={setRange} /><p class="mt-space-sm text-xs text-muted-foreground">当前范围：{displayRange(range())}</p></div></Section>
      <Section title="动态范围禁用" description="选择一端后通过 disabledDate 限制另一端，只允许 7 天窗口。"><RangePicker value={range()} onChange={setRange} disabledDate={dynamicDisabled} /></Section>
      <Section title="Prefix / Suffix" description="输入框复用 Input 能力，clear 和 suffix 互斥显示。"><DatePicker prefix={<span class="text-xs text-muted-foreground">开始</span>} suffix={<span class="text-xs">自定义</span>} /><DatePicker allowClear={false} suffix={<span class="text-xs">自定义</span>} /></Section>
      <Section title="Picker 面板" description="picker 覆盖 date/week/month/quarter/year 五种日期粒度。"><DatePicker placeholder="请选择日期" /><DatePicker picker="week" placeholder="请选择周" /><DatePicker picker="month" placeholder="请选择月份" /><DatePicker picker="quarter" placeholder="请选择季度" /><DatePicker picker="year" placeholder="请选择年份" /></Section>
      <Section title="格式化" description="format 只影响输入与展示；value/onChange 仍然保持 Temporal CalendarValue。"><DatePicker format="YYYY/MM/DD" placeholder="YYYY/MM/DD" /><DatePicker picker="month" format="YYYY/MM" placeholder="YYYY/MM" /></Section>
      <Section title="Range Picker 类型" description="范围选择同样支持 year/month/date/week/quarter。"><RangePicker /><RangePicker picker="week" /><RangePicker picker="month" /><RangePicker picker="quarter" /><RangePicker picker="year" /></Section>
      <Section title="切换日期和面板" description="受控 open 展示 Popover；Header 的单箭头切月、双箭头切年，年/月标签可切换面板。"><div class="space-y-space-sm"><div class="flex gap-space-sm"><Button size="sm" variant="outline" onClick={() => setOpen(true)}>打开面板</Button><Button size="sm" variant="outline" onClick={() => setOpen(false)}>关闭面板</Button></div><DatePicker open={open()} onOpenChange={setOpen} value={panelValue()} onChange={next => setDate(next, setPanelValue)} /><p class="text-xs text-muted-foreground">当前选择：{panelValue() ? getCalendarValueKey(panelValue()!) : '未选择'}</p></div></Section>
      <Section title="允许留空" description="RangePicker 可允许清空某一端，适合“至今”等场景。"><RangePicker allowEmpty={{ end: true }} /></Section>
      <Section title="自定义单元格" description="DatePickerPanel 透传 Calendar，可以直接自定义 CalendarGrid / CalendarCell。"><DatePicker panel={({ close }) => <div class="grid gap-space-sm p-space-md"><p class="text-sm text-muted-foreground">使用 Calendar primitive 的 Grid render function 自定义单元格。</p><Button size="sm" onClick={close}>关闭面板</Button></div>} /></Section>
      <Section title="自定义 Footer" description="Footer 通过 context 获取 close / confirm / cancel / clear。"><DatePicker needConfirm footer={({ clear, close, confirm }) => <div class="flex justify-end gap-space-sm p-space-sm"><Button size="sm" variant="ghost" onClick={clear}>清空</Button><Button size="sm" variant="outline" onClick={close}>只关闭</Button><Button size="sm" onClick={confirm}>确认</Button></div>} /></Section>
      <Section title="自定义面板" description="自定义面板可以调用 primitive 暴露的 close，并按业务自由组合内容。"><DatePicker panel={({ close }) => <div class="grid gap-space-sm p-space-md"><p class="text-sm text-muted-foreground">这是完全自定义面板，仍可访问关闭方法。</p><Button size="sm" onClick={close}>关闭面板</Button></div>} /></Section>
      <Section title="预设范围" description="预设会直接写入受控范围并保持面板打开，可用于报表、审计和运营筛选。"><div><div class="mb-space-sm flex gap-space-sm"><Button size="sm" variant="outline" onClick={() => setRange(lastDays(7))}>最近 7 天</Button><Button size="sm" variant="outline" onClick={() => setRange(lastDays(30))}>最近 30 天</Button></div><RangePicker value={range()} onChange={setRange} /></div></Section>
      <Section title="确认后提交" description="选择过程只更新面板草稿；点击确认后，才向外部提交范围。"><div><RangePicker needConfirm value={submitted()} onChange={setSubmitted} /><Button class="mt-space-sm" size="sm" onClick={() => setSubmitCount(count => count + 1)}>确认并提交</Button><span class="ml-space-sm text-xs text-muted-foreground">已提交 {submitCount()} 次</span></div></Section>
      <Section title="日期与时间" description="DatePicker 与 TimePicker 可分别组合，最终按业务需要一起提交。"><DatePicker /><TimePickerRoot defaultValue={{ hour: 9, minute: 30, second: 0 }} format="HH:mm"><TimePickerTrigger class="w-40" /><TimePickerContent><TimePickerPanel><TimePickerHourColumn /><TimePickerMinuteColumn /></TimePickerPanel></TimePickerContent></TimePickerRoot></Section>
    </div>
  </div></main>
}
