<script setup lang="ts">
import {
  createCalendarDate,
  getCalendarValueDate,
  getCalendarValueKey,
  type CalendarDate,
  type CalendarRange,
  type CalendarValue,
} from '@fex/components-core/calendar'
import { isAfterDate, isBeforeDate } from '@fex/components-core/date/utils'
import Button from '@fex/components-vue/ui/button'
import Card from '@fex/components-vue/ui/card'
import { ref } from 'vue'
import DemoDatePicker from './demo-date-picker.vue'
import CustomDemos from './custom-demos.vue'
import IntegrationDemos from './integration-demos.vue'
import StatusDemos from './status-demos.vue'

const today = createCalendarDate(2026, 7, 26)
const controlled = ref<CalendarValue | null>(today)
const multiple = ref<CalendarValue[]>([])
const range = ref<CalendarRange<CalendarValue>>({})
const dynamicRange = ref<CalendarRange<CalendarValue>>(lastDays(7))
const submitted = ref<CalendarRange<CalendarValue>>({})
const panelValue = ref<CalendarValue | null>(null)
const open = ref(false)
const disabledWeekend = (date: CalendarDate) => date.dayOfWeek === 6
const demoContentClass = 'flex min-w-0 flex-wrap items-start gap-space-md'

function setDate(
  next: CalendarValue | readonly CalendarValue[] | null,
  target: typeof controlled | typeof panelValue,
) {
  target.value = Array.isArray(next) ? null : (next as CalendarValue | null)
}
function setMultiple(next: CalendarValue | readonly CalendarValue[] | null) {
  multiple.value = Array.isArray(next) ? [...next] : []
}
function setRange(next: unknown) {
  range.value = next as CalendarRange<CalendarValue>
}
function setDynamicRange(next: unknown) {
  dynamicRange.value = next as CalendarRange<CalendarValue>
}
function setSubmitted(next: unknown) {
  submitted.value = next as CalendarRange<CalendarValue>
}
function setControlledValue(next: unknown) {
  setDate(next as CalendarValue | readonly CalendarValue[] | null, controlled)
}
function setPanelValue(next: unknown) {
  setDate(next as CalendarValue | readonly CalendarValue[] | null, panelValue)
}
function setMultipleValue(next: unknown) {
  setMultiple(next as CalendarValue | readonly CalendarValue[] | null)
}
function lastDays(days: number): CalendarRange<CalendarValue> {
  return { start: today.subtract({ days: days - 1 }), end: today }
}
function dynamicDisabled(date: CalendarDate, part: 'start' | 'end') {
  if (part === 'start') {
    if (!dynamicRange.value.end) return false
    const endDate = getCalendarValueDate(dynamicRange.value.end)
    return isBeforeDate(date, endDate.subtract({ days: 6 })) || isAfterDate(date, endDate)
  }
  if (!dynamicRange.value.start) return false
  const startDate = getCalendarValueDate(dynamicRange.value.start)
  return isBeforeDate(date, startDate) || isAfterDate(date, startDate.add({ days: 6 }))
}
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-xl">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/"
          >返回首页</RouterLink
        >
        <div>
          <h1 class="text-2xl font-semibold text-foreground">DatePicker</h1>
          <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
            DatePicker primitive 组合 Input、Popover 和
            Calendar，示例覆盖单选、多选、范围、禁用、面板切换和自定义渲染。
          </p>
        </div>
      </header>
      <div class="space-y-space-xl">
        <Card title="基本用法" description="非受控 DatePicker 选择后立即提交并关闭 Popover。"
          ><div :class="demoContentClass">
            <DemoDatePicker :default-value="today" placeholder="请选择日期" /></div
        ></Card>
        <Card
          title="受控与非受控"
          description="value/onChange 管理受控值，defaultValue 提供非受控初始值。"
          ><div :class="demoContentClass">
            <div>
              <DemoDatePicker :value="controlled" @change="setControlledValue" />
              <p class="mt-space-sm w-full text-xs text-muted-foreground">
                当前值：{{ controlled ? getCalendarValueKey(controlled) : '未选择' }}
              </p>
            </div>
            <DemoDatePicker :default-value="createCalendarDate(2026, 8, 1)" /></div
        ></Card>
        <Card
          title="禁用日期"
          description="minDate/maxDate 限定固定区间，disabledDate 承载业务规则。"
          ><div :class="demoContentClass">
            <DemoDatePicker
              :min-date="today.subtract({ days: 18 })"
              :max-date="today.add({ days: 25 })"
            /><DemoDatePicker :disabled-date="disabledWeekend" /><DemoDatePicker disabled /></div
        ></Card>
        <Card
          title="多选"
          description="multiple 使用 CalendarValue 数组，默认需要确认，不会选中后立刻关闭。"
          ><div :class="demoContentClass">
            <div>
              <DemoDatePicker multiple :value="multiple" @change="setMultipleValue" />
              <p class="mt-space-sm w-full text-xs text-muted-foreground">
                当前值：{{
                  multiple.length ? multiple.map(getCalendarValueKey).join(', ') : '未选择'
                }}
              </p>
            </div>
          </div></Card
        >
        <Card
          title="RangePicker"
          description="范围选择使用专门入口，双面板复用 Calendar range state。"
          ><div :class="demoContentClass">
            <div>
              <DemoDatePicker range :value="range" @change="setRange" />
              <p class="mt-space-sm w-full text-xs text-muted-foreground">
                当前范围：{{ range.start ? getCalendarValueKey(range.start) : '空' }} ~
                {{ range.end ? getCalendarValueKey(range.end) : '空' }}
              </p>
            </div>
          </div></Card
        >
        <Card
          title="动态范围禁用"
          description="选择一端后通过 disabledDate 限制另一端，只允许 7 天窗口。"
          ><div :class="demoContentClass">
            <div>
              <DemoDatePicker
                range
                :value="dynamicRange"
                :disabled-date="dynamicDisabled"
                @change="setDynamicRange"
              />
              <p class="mt-space-sm w-full text-xs text-muted-foreground">
                当前范围：{{
                  dynamicRange.start ? getCalendarValueKey(dynamicRange.start) : '空'
                }}
                ~ {{ dynamicRange.end ? getCalendarValueKey(dynamicRange.end) : '空' }}
              </p>
            </div>
          </div></Card
        >
        <Card
          title="Picker 面板"
          description="picker 覆盖 date/week/month/quarter/year 五种日期粒度。"
          ><div :class="demoContentClass">
            <DemoDatePicker picker="date" placeholder="请选择日期" /><DemoDatePicker
              picker="week"
              placeholder="请选择周"
            /><DemoDatePicker picker="month" placeholder="请选择月份" /><DemoDatePicker
              picker="quarter"
              placeholder="请选择季度"
            /><DemoDatePicker picker="year" placeholder="请选择年份" /></div
        ></Card>
        <Card
          title="格式化"
          description="format 只影响输入与展示；value/onChange 仍然保持 Temporal CalendarValue。"
          ><div :class="demoContentClass">
            <DemoDatePicker format="YYYY/MM/DD" placeholder="YYYY/MM/DD" /><DemoDatePicker
              picker="month"
              format="YYYY/MM"
              placeholder="YYYY/MM"
            /></div
        ></Card>
        <Card
          title="Range Picker 类型"
          description="范围选择同样支持 year/month/date/week/quarter。"
          ><div :class="demoContentClass">
            <DemoDatePicker range /><DemoDatePicker range picker="week" /><DemoDatePicker
              range
              picker="month"
            /><DemoDatePicker range picker="quarter" /><DemoDatePicker range picker="year" /></div
        ></Card>
        <StatusDemos />
        <CustomDemos />
        <Card
          title="切换日期和面板"
          description="受控 open 展示 Popover；Header 的单箭头切月、双箭头切年，年/月标签可切换面板。"
          ><div :class="demoContentClass">
            <div class="space-y-space-sm">
              <div class="flex gap-space-sm">
                <Button size="sm" variant="outline" @click="open = true">打开面板</Button
                ><Button size="sm" variant="outline" @click="open = false">关闭面板</Button>
              </div>
              <DemoDatePicker
                :open="open"
                :value="panelValue"
                @open-change="open = $event"
                @change="setPanelValue"
              />
            </div></div
        ></Card>
        <Card title="允许留空" description="RangePicker 可允许清空某一端，适合“至今”等场景。"
          ><div :class="demoContentClass"><DemoDatePicker range :allow-empty="{ end: true }" /></div
        ></Card>
        <IntegrationDemos />
      </div>
    </div>
  </main>
</template>
