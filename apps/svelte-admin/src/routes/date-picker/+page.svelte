<script lang="ts">
  import { createCalendarDate, getCalendarValueDate, getCalendarValueKey, type CalendarRange, type CalendarValue } from '@fex/components-core/calendar'
  import { isAfterDate, isBeforeDate } from '@fex/components-core/date/utils'
  import { DatePicker, RangePicker } from '@fex/components-svelte/primitive/date-picker'
  import { TimePickerContent, TimePickerHourColumn, TimePickerMinuteColumn, TimePickerPanel, TimePickerRoot, TimePickerTrigger } from '@fex/components-svelte/primitive/time-picker'
  import Button from '@fex/components-svelte/ui/button'
  import Card from '@fex/components-svelte/ui/card'

  const today = createCalendarDate(2026, 7, 26)
  const minDate = createCalendarDate(2026, 7, 8)
  const maxDate = createCalendarDate(2026, 8, 20)
  let controlled: CalendarValue | null = $state(today)
  let multiple: CalendarValue | readonly CalendarValue[] | null = $state([])
  let range: CalendarRange<CalendarValue> = $state({})
  let submitted: CalendarRange<CalendarValue> = $state({})
  let panelValue: CalendarValue | null = $state(null)
  let open = $state(false)
  let submitCount = $state(0)
  const lastDays = (days: number): CalendarRange<CalendarValue> => ({ start: today.subtract({ days: days - 1 }), end: today })
  function setDate(next: CalendarValue | readonly CalendarValue[] | null, target: 'controlled' | 'panel') { if (target === 'controlled') controlled = Array.isArray(next) ? null : next; else panelValue = Array.isArray(next) ? null : next }
  function setMultiple(next: CalendarValue | readonly CalendarValue[] | null) { multiple = Array.isArray(next) ? next : [] }
  function dynamicDisabled(date: CalendarValue, part: 'start' | 'end') { const from = part === 'end' ? range.start : range.end; return Boolean(from && (isBeforeDate(date, getCalendarValueDate(from).subtract({ days: 6 })) || isAfterDate(date, getCalendarValueDate(from).add({ days: 6 })))) }
</script>

<svelte:head><title>DatePicker - Svelte Admin</title></svelte:head>

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl">
  <header class="space-y-space-xl"><a class="text-sm text-muted-foreground hover:text-foreground" href="/">返回首页</a><div><h1 class="text-2xl font-semibold text-foreground">DatePicker</h1><p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">DatePicker primitive 组合 Input、Popover 和 Calendar，示例覆盖单选、多选、范围、禁用、面板切换和自定义渲染。</p></div></header>
  <div class="space-y-space-xl">
    <Card title="基本用法" description="非受控 DatePicker 选择后立即提交并关闭 Popover。"><div class="w-56"><DatePicker defaultValue={today} placeholder="请选择日期" /></div></Card>
    <Card title="受控与非受控" description="value/onChange 管理受控值，defaultValue 提供非受控初始值。"><div class="flex flex-wrap items-start gap-space-md"><div><DatePicker value={controlled} onChange={next => setDate(next, 'controlled')} /><p class="mt-space-sm text-xs text-muted-foreground">当前值：{controlled ? getCalendarValueKey(controlled) : '未选择'}</p></div><DatePicker defaultValue={createCalendarDate(2026, 8, 1)} /></div></Card>
    <Card title="禁用日期" description="minDate/maxDate 限定固定区间，disabledDate 承载业务规则。"><div class="flex flex-wrap gap-space-md"><DatePicker {minDate} {maxDate} /><DatePicker disabledDate={date => isBeforeDate(date, today) || date.dayOfWeek === 6} /><DatePicker disabled /></div></Card>
    <Card title="多选" description="multiple 使用 CalendarValue 数组，默认需要确认，不会选中后立刻关闭。"><div><DatePicker multiple value={multiple} onChange={setMultiple} /><p class="mt-space-sm text-xs text-muted-foreground">当前值：{Array.isArray(multiple) ? multiple.map(getCalendarValueKey).join(', ') || '未选择' : '未选择'}</p></div></Card>
    <Card title="RangePicker" description="范围选择使用专门入口，双面板复用 Calendar range state。"><div><RangePicker value={range} onChange={next => range = next} /><p class="mt-space-sm text-xs text-muted-foreground">当前范围：{range.start ? getCalendarValueKey(range.start) : '空'} ~ {range.end ? getCalendarValueKey(range.end) : '空'}</p></div></Card>
    <Card title="动态范围禁用" description="选择一端后通过 disabledDate 限制另一端，只允许 7 天窗口。"><RangePicker value={range} onChange={next => range = next} disabledDate={dynamicDisabled} /></Card>
    <Card title="Prefix / Suffix" description="输入框复用 Input 能力，clear 和 suffix 互斥显示。"><div class="flex flex-wrap gap-space-md"><DatePicker allowClear={false} /><DatePicker allowClear={false} /></div></Card>
    <Card title="Picker 面板" description="picker 覆盖 date/week/month/quarter/year 五种日期粒度。"><div class="flex flex-wrap gap-space-md"><DatePicker placeholder="请选择日期" /><DatePicker picker="week" placeholder="请选择周" /><DatePicker picker="month" placeholder="请选择月份" /><DatePicker picker="quarter" placeholder="请选择季度" /><DatePicker picker="year" placeholder="请选择年份" /></div></Card>
    <Card title="格式化" description="format 只影响输入与展示；value/onChange 仍然保持 Temporal CalendarValue。"><div class="flex flex-wrap gap-space-md"><DatePicker format="YYYY/MM/DD" placeholder="YYYY/MM/DD" /><DatePicker picker="month" format="YYYY/MM" placeholder="YYYY/MM" /></div></Card>
    <Card title="Range Picker 类型" description="范围选择同样支持 year/month/date/week/quarter。"><div class="flex flex-wrap gap-space-md"><RangePicker /><RangePicker picker="week" /><RangePicker picker="month" /><RangePicker picker="quarter" /><RangePicker picker="year" /></div></Card>
    <Card title="切换日期和面板" description="受控 open 展示 Popover；Header 的单箭头切月、双箭头切年，年/月标签可切换面板。"><div class="space-y-space-sm"><div class="flex gap-space-sm"><Button size="sm" variant="outline" onclick={() => open = true}>打开面板</Button><Button size="sm" variant="outline" onclick={() => open = false}>关闭面板</Button></div><DatePicker {open} onOpenChange={next => open = next} value={panelValue} onChange={next => setDate(next, 'panel')} /><p class="text-xs text-muted-foreground">当前选择：{panelValue ? getCalendarValueKey(panelValue) : '未选择'}</p></div></Card>
    <Card title="允许留空" description="RangePicker 可允许清空某一端，适合“至今”等场景。"><RangePicker allowEmpty={{ end: true }} /></Card>
    <Card title="自定义单元格" description="DatePickerPanel 透传 Calendar，可以直接自定义 CalendarGrid / CalendarCell。"><DatePicker /></Card>
    <Card title="自定义 Footer" description="Footer 通过 context 获取 close / confirm / cancel / clear。"><DatePicker needConfirm /></Card>
    <Card title="自定义面板" description="自定义面板可以调用 primitive 暴露的 close，并按业务自由组合内容。"><DatePicker /></Card>
    <Card title="预设范围" description="预设会直接写入受控范围并保持面板打开，可用于报表、审计和运营筛选。"><div><div class="mb-space-sm flex gap-space-sm"><Button size="sm" variant="outline" onclick={() => range = lastDays(7)}>最近 7 天</Button><Button size="sm" variant="outline" onclick={() => range = lastDays(30)}>最近 30 天</Button></div><RangePicker value={range} onChange={next => range = next} /></div></Card>
    <Card title="确认后提交" description="选择过程只更新面板草稿；点击确认后，才向外部提交范围。"><div><RangePicker needConfirm value={submitted} onChange={next => submitted = next} /><Button class="mt-space-sm" size="sm" onclick={() => submitCount += 1}>确认并提交</Button><span class="ml-space-sm text-xs text-muted-foreground">已提交 {submitCount} 次</span></div></Card>
    <Card title="日期与时间" description="DatePicker 与 TimePicker 可分别组合，最终按业务需要一起提交。"><div class="flex flex-wrap gap-space-md"><DatePicker /><TimePickerRoot defaultValue={{ hour: 9, minute: 30, second: 0 }} format="HH:mm"><TimePickerTrigger /><TimePickerContent><TimePickerPanel><TimePickerHourColumn /><TimePickerMinuteColumn /></TimePickerPanel></TimePickerContent></TimePickerRoot></div></Card>
  </div>
</div></main>
