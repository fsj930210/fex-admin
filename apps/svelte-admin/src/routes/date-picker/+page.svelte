<script lang="ts">
  import { createCalendarDate, getCalendarValueDate, getCalendarValueKey, type CalendarDate, type CalendarRange, type CalendarValue } from '@fex/components-core/calendar'
  import { isAfterDate, isBeforeDate } from '@fex/components-core/date/utils'
  import Button from '@fex/components-svelte/ui/button'
  import Card from '@fex/components-svelte/ui/card'
  import DemoDatePicker from './demo-date-picker.svelte'
  import CustomDemos from './custom-demos.svelte'
  import IntegrationDemos from './integration-demos.svelte'

  const today = createCalendarDate(2026, 7, 26)
  const lastDays = (days: number): CalendarRange<CalendarValue> => ({ start: today.subtract({ days: days - 1 }), end: today })
  const demoContentClass = 'flex min-w-0 flex-wrap items-start gap-space-md'
  let controlled: CalendarValue | null = $state(today)
  let multiple: CalendarValue[] = $state([])
  let range: CalendarRange<CalendarValue> = $state({})
  let dynamicRange: CalendarRange<CalendarValue> = $state(lastDays(7))
  let submitted: CalendarRange<CalendarValue> = $state({})
  let panelValue: CalendarValue | null = $state(null)
  let open = $state(false)

  function setDate(next: unknown, target: 'controlled' | 'panel') {
    const value = Array.isArray(next) ? null : next as CalendarValue | null
    if (target === 'controlled') controlled = value
    else panelValue = value
  }
  function setMultiple(next: unknown) { multiple = Array.isArray(next) ? [...next] as CalendarValue[] : [] }
  function setRange(next: unknown) { range = next as CalendarRange<CalendarValue> }
  function setDynamicRange(next: unknown) { dynamicRange = next as CalendarRange<CalendarValue> }
  function setSubmitted(next: unknown) { submitted = next as CalendarRange<CalendarValue> }
  function dynamicDisabled(date: CalendarDate, part: 'start' | 'end') {
    if (part === 'start') {
      if (!dynamicRange.end) return false
      const endDate = getCalendarValueDate(dynamicRange.end)
      return isBeforeDate(date, endDate.subtract({ days: 6 })) || isAfterDate(date, endDate)
    }
    if (!dynamicRange.start) return false
    const startDate = getCalendarValueDate(dynamicRange.start)
    return isBeforeDate(date, startDate) || isAfterDate(date, startDate.add({ days: 6 }))
  }
</script>

<svelte:head><title>DatePicker - Svelte Admin</title></svelte:head>

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-5xl space-y-space-xl">
    <header class="space-y-space-xl">
      <a class="text-sm text-muted-foreground hover:text-foreground" href="/">返回首页</a>
      <div>
        <h1 class="text-2xl font-semibold text-foreground">DatePicker</h1>
        <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">DatePicker primitive 组合 Input、Popover 和 Calendar，示例覆盖单选、多选、范围、禁用、面板切换和自定义渲染。</p>
      </div>
    </header>

    <div class="space-y-space-xl">
      <Card title="基本用法" description="非受控 DatePicker 选择后立即提交并关闭 Popover。" class={{ content: demoContentClass }}><DemoDatePicker defaultValue={today} placeholder="请选择日期" /></Card>
      <Card title="受控与非受控" description="value/onChange 管理受控值，defaultValue 提供非受控初始值。" class={{ content: demoContentClass }}><div><DemoDatePicker value={controlled} onChange={(next) => setDate(next, 'controlled')} /><p class="mt-space-sm w-full text-xs text-muted-foreground">当前值：{controlled ? getCalendarValueKey(controlled) : '未选择'}</p></div><DemoDatePicker defaultValue={createCalendarDate(2026, 8, 1)} /></Card>
      <Card title="禁用日期" description="minDate/maxDate 限定固定区间，disabledDate 承载业务规则。" class={{ content: demoContentClass }}><DemoDatePicker minDate={today.subtract({ days: 18 })} maxDate={today.add({ days: 25 })} /><DemoDatePicker disabledDate={(date) => date.dayOfWeek === 6} /><DemoDatePicker disabled /></Card>
      <Card title="多选" description="multiple 使用 CalendarValue 数组，默认需要确认，不会选中后立刻关闭。" class={{ content: demoContentClass }}><div><DemoDatePicker multiple value={multiple} onChange={setMultiple} /><p class="mt-space-sm w-full text-xs text-muted-foreground">当前值：{multiple.length ? multiple.map(getCalendarValueKey).join(', ') : '未选择'}</p></div></Card>
      <Card title="RangePicker" description="范围选择使用专门入口，双面板复用 Calendar range state。" class={{ content: demoContentClass }}><div><DemoDatePicker range value={range} onChange={setRange} /><p class="mt-space-sm w-full text-xs text-muted-foreground">当前范围：{range.start ? getCalendarValueKey(range.start) : '空'} ~ {range.end ? getCalendarValueKey(range.end) : '空'}</p></div></Card>
      <Card title="动态范围禁用" description="选择一端后通过 disabledDate 限制另一端，只允许 7 天窗口。" class={{ content: demoContentClass }}><div><DemoDatePicker range value={dynamicRange} disabledDate={dynamicDisabled} onChange={setDynamicRange} /><p class="mt-space-sm w-full text-xs text-muted-foreground">当前范围：{dynamicRange.start ? getCalendarValueKey(dynamicRange.start) : '空'} ~ {dynamicRange.end ? getCalendarValueKey(dynamicRange.end) : '空'}</p></div></Card>
      <Card title="Picker 面板" description="picker 覆盖 date/week/month/quarter/year 五种日期粒度。" class={{ content: demoContentClass }}><DemoDatePicker picker="date" placeholder="请选择日期" /><DemoDatePicker picker="week" placeholder="请选择周" /><DemoDatePicker picker="month" placeholder="请选择月份" /><DemoDatePicker picker="quarter" placeholder="请选择季度" /><DemoDatePicker picker="year" placeholder="请选择年份" /></Card>
      <Card title="格式化" description="format 只影响输入与展示；value/onChange 仍然保持 Temporal CalendarValue。" class={{ content: demoContentClass }}><DemoDatePicker format="YYYY/MM/DD" placeholder="YYYY/MM/DD" /><DemoDatePicker picker="month" format="YYYY/MM" placeholder="YYYY/MM" /></Card>
      <Card title="Range Picker 类型" description="范围选择同样支持 year/month/date/week/quarter。" class={{ content: demoContentClass }}><DemoDatePicker range /><DemoDatePicker range picker="week" /><DemoDatePicker range picker="month" /><DemoDatePicker range picker="quarter" /><DemoDatePicker range picker="year" /></Card>
      <CustomDemos />
      <Card title="切换日期和面板" description="受控 open 展示 Popover；Header 的单箭头切月、双箭头切年，年/月标签可切换面板。" class={{ content: demoContentClass }}><div class="space-y-space-sm"><div class="flex gap-space-sm"><Button size="sm" variant="outline" onclick={() => open = true}>打开面板</Button><Button size="sm" variant="outline" onclick={() => open = false}>关闭面板</Button></div><DemoDatePicker {open} value={panelValue} onOpenChange={(next) => open = next} onChange={(next) => setDate(next, 'panel')} /></div></Card>
      <Card title="允许留空" description="RangePicker 可允许清空某一端，适合“至今”等场景。" class={{ content: demoContentClass }}><DemoDatePicker range allowEmpty={{ end: true }} /></Card>
      <IntegrationDemos />
    </div>
  </div>
</main>
