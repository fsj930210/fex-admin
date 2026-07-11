<script setup lang="ts">
import {
  compareCalendarDate,
  createCalendarDate,
  getCalendarValueKey,
  type CalendarCell,
  type CalendarValue,
} from '@fex/components-core/calendar'
import {
  CalendarCell as CalendarCellButton,
  CalendarGrid,
  CalendarHeader,
  CalendarNavigationButton,
  CalendarRoot,
  CalendarWeekHeader,
} from '@fex/components-vue/primitive/calendar'
import Card from '@fex/components-vue/ui/card'
import { ref } from 'vue'

const july = createCalendarDate(2026, 7, 1)
const today = createCalendarDate(2026, 7, 11)
const minDate = createCalendarDate(2026, 7, 5)
const maxDate = createCalendarDate(2026, 7, 24)
const minYearPanelDate = createCalendarDate(2024, 1, 1)

const scheduleMap = new Map([
  ['date:2026-07-08', '评审'],
  ['date:2026-07-11', '发布'],
  ['date:2026-07-18', '值班'],
])

const dateValue = ref<CalendarValue | null>(today)
const weekValue = ref<CalendarValue | null>(null)
const monthValue = ref<CalendarValue | null>(null)
const quarterValue = ref<CalendarValue | null>(null)
const yearValue = ref<CalendarValue | null>(null)

function getCellClassName(cell: CalendarCell) {
  return [
    'flex min-h-14 items-center justify-center rounded-md p-space-xs text-center text-sm',
    cell.state.disabled ? 'cursor-not-allowed opacity-40' : '',
    cell.state.outside && !cell.state.selected ? 'text-muted-foreground' : 'text-foreground',
  ]
}

function getContentClassName(cell: CalendarCell) {
  return [
    'inline-flex h-16 w-20 flex-col items-center justify-center rounded-md border px-space-sm py-space-xs transition-colors',
    cell.state.selected ? 'bg-foreground text-background shadow-sm' : '',
    cell.state.today && !cell.state.selected ? 'border-primary' : 'border-transparent',
    !cell.state.disabled && !cell.state.selected ? 'hover:bg-muted-background' : '',
  ]
}

function getDateLabelClassName(cell: CalendarCell) {
  return 'font-medium'
}

function getScheduleLabel(cell: CalendarCell) {
  return scheduleMap.get(getCalendarValueKey(cell.value))
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
          <h1 class="text-2xl font-semibold text-foreground">Calendar</h1>
          <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
            基于 Temporal 的 Calendar core 和 Vue
            primitive。当前只展示基础网格、粒度、禁用日期和自定义 cell 内容，不包含 ui 封装。
          </p>
        </div>
      </header>

      <div class="space-y-space-xl">
        <Card title="Date" description="日期面板支持受控值、禁用区间和自定义单元格内容。">
          <CalendarRoot
            :value="dateValue"
            :default-view-date="july"
            :today="today"
            :min="minDate"
            :max="maxDate"
            @value-change="dateValue = $event"
          >
            <CalendarHeader class="mb-space-md">
              <template #default="{ viewDate, panel }">
                <div class="flex flex-wrap items-center justify-between gap-space-md">
                  <div>
                    <div class="text-sm font-medium text-foreground">
                      {{ viewDate.year }} 年 {{ viewDate.month }} 月
                    </div>
                    <div class="text-xs text-muted-foreground">panel: {{ panel }}</div>
                  </div>
                  <div class="flex items-center gap-space-sm">
                    <CalendarNavigationButton
                      action="previous-year"
                      aria-label="上一年"
                      class="size-8 rounded-md border border-border text-sm hover:border-focus hover:bg-muted-background"
                      >«</CalendarNavigationButton
                    >
                    <CalendarNavigationButton
                      action="previous-month"
                      aria-label="上一月"
                      class="size-8 rounded-md border border-border text-sm hover:border-focus hover:bg-muted-background"
                      >‹</CalendarNavigationButton
                    >
                    <CalendarNavigationButton
                      action="next-month"
                      aria-label="下一月"
                      class="size-8 rounded-md border border-border text-sm hover:border-focus hover:bg-muted-background"
                      >›</CalendarNavigationButton
                    >
                    <CalendarNavigationButton
                      action="next-year"
                      aria-label="下一年"
                      class="size-8 rounded-md border border-border text-sm hover:border-focus hover:bg-muted-background"
                      >»</CalendarNavigationButton
                    >
                  </div>
                </div>
              </template>
            </CalendarHeader>
            <CalendarWeekHeader
              class="mb-space-sm grid grid-cols-7 gap-space-sm text-center text-xs text-muted-foreground"
            />
            <CalendarGrid
              class="grid gap-space-sm [&_[data-slot=calendar-row]]:grid [&_[data-slot=calendar-row]]:grid-cols-7 [&_[data-slot=calendar-row]]:gap-space-sm"
            >
              <template #default="{ cell }">
                <CalendarCellButton :cell="cell" :class="getCellClassName(cell)">
                  <span :class="getContentClassName(cell)">
                    <span :class="getDateLabelClassName(cell)">{{ cell.label }}</span>
                    <span
                      v-if="getScheduleLabel(cell)"
                      class="mt-space-xs block h-4 text-xs leading-4 opacity-80"
                    >
                      {{ getScheduleLabel(cell) }}
                    </span>
                  </span>
                </CalendarCellButton>
              </template>
            </CalendarGrid>
            <p class="mt-space-md text-sm text-muted-foreground">
              当前值：{{ dateValue ? getCalendarValueKey(dateValue) : '未选择' }}
            </p>
          </CalendarRoot>
        </Card>

        <Card
          title="Week"
          description="周粒度会把同一行日期映射到同一个 week value，供 WeekPicker 复用。"
        >
          <CalendarRoot
            granularity="week"
            :default-view-date="july"
            :today="today"
            :value="weekValue"
            @value-change="weekValue = $event"
          >
            <CalendarWeekHeader
              class="mb-space-sm grid grid-cols-7 gap-space-sm text-center text-xs text-muted-foreground"
            />
            <CalendarGrid
              class="grid gap-space-sm [&_[data-slot=calendar-row]]:grid [&_[data-slot=calendar-row]]:grid-cols-7 [&_[data-slot=calendar-row]]:gap-space-sm"
            >
              <template #default="{ cell }">
                <CalendarCellButton :cell="cell" :class="getCellClassName(cell)">
                  <span :class="getContentClassName(cell)">
                    <span :class="getDateLabelClassName(cell)">{{ cell.label }}</span>
                  </span>
                </CalendarCellButton>
              </template>
            </CalendarGrid>
            <p class="mt-space-md text-sm text-muted-foreground">
              当前周：{{ weekValue ? getCalendarValueKey(weekValue) : '未选择' }}
            </p>
          </CalendarRoot>
        </Card>

        <Card
          title="Month / Quarter / Year"
          description="月份、季度、年份作为独立粒度，不用日期值冒充。"
        >
          <div class="grid gap-space-xl lg:grid-cols-3">
            <div
              v-for="item in [
                { title: 'Month', panel: 'month', granularity: 'month', value: monthValue },
                { title: 'Quarter', panel: 'quarter', granularity: 'quarter', value: quarterValue },
                { title: 'Year', panel: 'year', granularity: 'year', value: yearValue },
              ]"
              :key="item.title"
              class="min-w-0 flex-1"
            >
              <h3 class="mb-space-md text-sm font-medium text-foreground">{{ item.title }}</h3>
              <CalendarRoot
                :default-view-date="july"
                :default-panel="item.panel as any"
                :granularity="item.granularity as any"
                :value="item.value"
                :disabled-date="
                  (date) =>
                    item.granularity === 'year' && compareCalendarDate(date, minYearPanelDate) < 0
                "
                @value-change="
                  (nextValue) => {
                    if (item.title === 'Month') monthValue = nextValue
                    if (item.title === 'Quarter') quarterValue = nextValue
                    if (item.title === 'Year') yearValue = nextValue
                  }
                "
              >
                <CalendarGrid
                  class="grid gap-space-sm [&_[data-slot=calendar-row]]:grid [&_[data-slot=calendar-row]]:grid-cols-4 [&_[data-slot=calendar-row]]:gap-space-sm"
                >
                  <template #default="{ cell }">
                    <CalendarCellButton :cell="cell" :class="getCellClassName(cell)">
                      <span :class="getContentClassName(cell)">
                        <span :class="getDateLabelClassName(cell)">{{ cell.label }}</span>
                      </span>
                    </CalendarCellButton>
                  </template>
                </CalendarGrid>
              </CalendarRoot>
              <p class="mt-space-md text-xs text-muted-foreground">
                {{ item.value ? getCalendarValueKey(item.value) : '未选择' }}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </main>
</template>
