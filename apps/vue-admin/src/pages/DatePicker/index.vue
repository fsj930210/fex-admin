<script setup lang="ts">
import { createCalendarDate, getCalendarValueDate, getCalendarValueKey, type CalendarRange, type CalendarValue } from '@fex/components-core/calendar'
import { isAfterDate, isBeforeDate } from '@fex/components-core/date/utils'
import { DatePicker, RangePicker } from '@fex/components-vue/primitive/date-picker'
import { TimePickerHourColumn, TimePickerMinuteColumn, TimePickerPanel, TimePickerRoot, type TimeValue } from '@fex/components-vue/primitive/time-picker'
import Button from '@fex/components-vue/ui/button'
import Card from '@fex/components-vue/ui/card'
import { ref } from 'vue'

const today = createCalendarDate(2026, 7, 26)
const minDate = createCalendarDate(2026, 7, 8)
const maxDate = createCalendarDate(2026, 8, 20)
const controlled = ref<CalendarValue | null>(today)
const multiple = ref<CalendarValue[]>([])
const range = ref<CalendarRange<CalendarValue>>({})
const submitted = ref<CalendarRange<CalendarValue>>({})
const panelValue = ref<CalendarValue | null>(null)
const open = ref(false)
const submitCount = ref(0)
const dateTimeDate = ref<CalendarValue | null>(today)
const dateTime = ref<TimeValue>({ hour: 9, minute: 30, second: 0 })

function setDate(next: CalendarValue | readonly CalendarValue[] | null, target: typeof controlled | typeof panelValue) {
  target.value = Array.isArray(next) ? null : next
}
function setMultiple(next: CalendarValue | readonly CalendarValue[] | null) { multiple.value = Array.isArray(next) ? [...next] : [] }
function lastDays(days: number): CalendarRange<CalendarValue> { return { start: today.subtract({ days: days - 1 }), end: today } }
function previousMonth(): CalendarRange<CalendarValue> {
  const end = today.with({ day: 1 }).subtract({ days: 1 })
  return { start: end.with({ day: 1 }), end }
}
function formatTime(value: TimeValue) { return `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}` }
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-xl">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">返回首页</RouterLink>
        <div><h1 class="text-2xl font-semibold text-foreground">DatePicker</h1><p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">DatePicker primitive 组合 Input、Popover 和 Calendar，示例覆盖单选、多选、范围、禁用、面板切换和自定义渲染。</p></div>
      </header>
      <div class="space-y-space-xl">
        <Card title="基本用法" description="非受控 DatePicker 选择后立即提交并关闭 Popover。"><DatePicker class="w-56" :default-value="today" placeholder="请选择日期" /></Card>
        <Card title="受控与非受控" description="value/change 管理受控值，defaultValue 提供非受控初始值。"><div class="flex flex-wrap items-start gap-space-md"><div><DatePicker :value="controlled" @change="setDate($event, controlled)" /><p class="mt-space-sm text-xs text-muted-foreground">当前值：{{ controlled ? getCalendarValueKey(controlled) : '未选择' }}</p></div><DatePicker :default-value="createCalendarDate(2026, 8, 1)" /></div></Card>
        <Card title="禁用日期" description="minDate/maxDate 限定固定区间，disabledDate 承载业务规则。"><div class="flex flex-wrap gap-space-md"><DatePicker :min-date="minDate" :max-date="maxDate" /><DatePicker :disabled-date="date => isBeforeDate(date, today) || date.dayOfWeek === 6" /><DatePicker disabled /></div></Card>
        <Card title="多选" description="multiple 使用 CalendarValue 数组，默认需要确认，不会选中后立刻关闭。"><div><DatePicker multiple :value="multiple" @change="setMultiple" /><p class="mt-space-sm text-xs text-muted-foreground">当前值：{{ multiple.map(item => getCalendarValueKey(item)).join(', ') || '未选择' }}</p></div></Card>
        <Card title="RangePicker" description="范围选择使用专门入口，双面板复用 Calendar range state。"><div><RangePicker :value="range" @change="range = $event" /><p class="mt-space-sm text-xs text-muted-foreground">当前范围：{{ range.start ? getCalendarValueKey(range.start) : '空' }} ~ {{ range.end ? getCalendarValueKey(range.end) : '空' }}</p></div></Card>
        <Card title="动态范围禁用" description="选择一端后通过 disabledDate 限制另一端，只允许 7 天窗口。"><RangePicker :value="range" :disabled-date="(date, part) => { const from = part === 'end' ? range.start : range.end; return !from ? false : isBeforeDate(date, getCalendarValueDate(from).subtract({ days: 6 })) || isAfterDate(date, getCalendarValueDate(from).add({ days: 6 })) }" @change="range = $event" /></Card>
        <Card title="Prefix / Suffix" description="输入框复用 Input 能力，clear 和 suffix 互斥显示。"><div class="flex flex-wrap gap-space-md"><DatePicker><template #prefix><span class="text-xs text-muted-foreground">开始</span></template><template #suffix>自定义</template></DatePicker><DatePicker :allow-clear="false"><template #suffix><span class="text-xs">自定义</span></template></DatePicker></div></Card>
        <Card title="Picker 面板" description="picker 覆盖 date/week/month/quarter/year 五种日期粒度。"><div class="flex flex-wrap gap-space-md"><DatePicker :default-value="today" placeholder="请选择日期" /><DatePicker picker="week" placeholder="请选择周" /><DatePicker picker="month" placeholder="请选择月份" /><DatePicker picker="quarter" placeholder="请选择季度" /><DatePicker picker="year" placeholder="请选择年份" /></div></Card>
        <Card title="格式化" description="format 只影响输入与展示；value/change 仍然保持 Temporal CalendarValue。"><div class="flex flex-wrap gap-space-md"><DatePicker format="YYYY/MM/DD" placeholder="YYYY/MM/DD" /><DatePicker picker="month" format="YYYY/MM" placeholder="YYYY/MM" /></div></Card>
        <Card title="Range Picker 类型" description="范围选择同样支持 year/month/date/week/quarter。"><div class="flex flex-wrap gap-space-md"><RangePicker /><RangePicker picker="week" /><RangePicker picker="month" /><RangePicker picker="quarter" /><RangePicker picker="year" /></div></Card>
        <Card title="切换日期和面板" description="受控 open 展示 Popover；Header 的单箭头切月、双箭头切年，年/月标签可切换面板。"><div class="space-y-space-sm"><div class="flex gap-space-sm"><Button size="sm" variant="outline" @click="open = true">打开面板</Button><Button size="sm" variant="outline" @click="open = false">关闭面板</Button></div><DatePicker :open="open" :value="panelValue" @open-change="open = $event" @change="setDate($event, panelValue)" /><p class="text-xs text-muted-foreground">当前选择：{{ panelValue ? getCalendarValueKey(panelValue) : '未选择' }}</p></div></Card>
        <Card title="允许留空" description="RangePicker 可允许清空某一端，适合“至今”等场景。"><RangePicker :allow-empty="{ end: true }" /></Card>
        <Card title="自定义单元格" description="DatePickerPanel 透传 Calendar，可以直接自定义 CalendarGrid / CalendarCell。"><DatePicker><template #panel="{ close }"><div class="grid gap-space-sm p-space-md"><p class="text-sm text-muted-foreground">该框架可通过 panel slot 组合 Calendar，自定义单元格由 Calendar slot 继续透传。</p><Button size="sm" @click="close">关闭面板</Button></div></template></DatePicker></Card>
        <Card title="自定义 Footer" description="Footer slot 可获取 close / confirm / cancel / clear。"><DatePicker need-confirm><template #footer="{ clear, close, confirm }"><div class="flex justify-end gap-space-sm p-space-sm"><Button size="sm" variant="ghost" @click="clear">清空</Button><Button size="sm" variant="outline" @click="close">只关闭</Button><Button size="sm" @click="confirm">确认</Button></div></template></DatePicker></Card>
        <Card title="自定义面板" description="自定义面板可以调用 primitive 暴露的 close，并按业务自由组合内容。"><DatePicker><template #panel="{ close }"><div class="grid gap-space-sm p-space-md"><p class="text-sm text-muted-foreground">这是完全自定义面板，仍可访问关闭方法。</p><Button size="sm" @click="close">关闭面板</Button></div></template></DatePicker></Card>
        <Card title="预设范围" description="预设会直接写入受控范围并保持面板打开，可用于报表、审计和运营筛选。"><div><div class="mb-space-sm flex flex-wrap gap-space-sm"><Button size="sm" variant="outline" @click="range = lastDays(7)">最近 7 天</Button><Button size="sm" variant="outline" @click="range = lastDays(30)">最近 30 天</Button><Button size="sm" variant="outline" @click="range = previousMonth()">上月</Button></div><RangePicker :value="range" @change="range = $event" /></div></Card>
        <Card title="确认后提交" description="选择过程只更新面板草稿；点击确认后，才向外部提交范围。"><div><RangePicker need-confirm :value="submitted" @change="submitted = $event" /><div class="mt-space-sm flex items-center gap-space-sm"><Button size="sm" @click="submitCount += 1">记录提交</Button><span class="text-xs text-muted-foreground">已提交 {{ submitCount }} 次</span></div></div></Card>
        <Card title="日期与时间" description="一个触发器组合日期和时间，确认后一起关闭面板。"><DatePicker class="w-64" need-confirm :value="dateTimeDate" :display-value="`${dateTimeDate ? getCalendarValueKey(dateTimeDate) : ''} ${formatTime(dateTime)}`.trim()" @change="setDate($event, dateTimeDate)"><template #panel-extra><TimePickerRoot :value="dateTime" format="HH:mm" @change="next => { if (next) dateTime = next }"><TimePickerPanel class="h-80 min-h-0 overflow-hidden"><TimePickerHourColumn class="h-full" /><TimePickerMinuteColumn class="h-full" /></TimePickerPanel></TimePickerRoot></template></DatePicker></Card>
      </div>
    </div>
  </main>
</template>
