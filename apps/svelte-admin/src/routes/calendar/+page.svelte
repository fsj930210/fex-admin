<script lang="ts">
  import {
    compareCalendarDate,
    createCalendarDate,
    getCalendarValueKey,
    type CalendarCell as CalendarCellModel,
    type CalendarValue,
  } from '@fex/components-core/calendar'
  import CalendarRoot from '@fex/components-svelte/primitive/calendar'
  import CalendarCell from '@fex/components-svelte/primitive/calendar-cell'
  import CalendarGrid from '@fex/components-svelte/primitive/calendar-grid'
  import CalendarHeader from '@fex/components-svelte/primitive/calendar-header'
  import CalendarNavigationButton from '@fex/components-svelte/primitive/calendar-navigation-button'
  import CalendarWeekHeader from '@fex/components-svelte/primitive/calendar-week-header'
  import Card from '@fex/components-svelte/ui/card'
  import type { Snippet } from 'svelte'

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

  let dateValue: CalendarValue | null = $state(today)
  let weekValue: CalendarValue | null = $state(null)
  let monthValue: CalendarValue | null = $state(null)
  let quarterValue: CalendarValue | null = $state(null)
  let yearValue: CalendarValue | null = $state(null)

  function getCellClassName(cell: CalendarCellModel) {
    return [
      'flex min-h-14 items-center justify-center rounded-md p-space-xs text-center text-sm',
      cell.state.disabled ? 'cursor-not-allowed opacity-40' : '',
      cell.state.outside && !cell.state.selected ? 'text-muted-foreground' : 'text-foreground',
    ]
  }

  function getContentClassName(cell: CalendarCellModel) {
    return [
      'inline-flex h-16 w-20 flex-col items-center justify-center rounded-md border px-space-sm py-space-xs transition-colors',
      cell.state.selected ? 'bg-foreground text-background shadow-sm' : '',
      cell.state.today && !cell.state.selected ? 'border-primary' : 'border-transparent',
      !cell.state.disabled && !cell.state.selected ? 'hover:bg-muted-background' : '',
    ]
  }

  function getDateLabelClassName(cell: CalendarCellModel) {
    return 'font-medium'
  }

  function getScheduleLabel(cell: CalendarCellModel) {
    return scheduleMap.get(getCalendarValueKey(cell.value))
  }

  type UnitDemo = {
    title: 'Month' | 'Quarter' | 'Year'
    panel: 'month' | 'quarter' | 'year'
    granularity: 'month' | 'quarter' | 'year'
  }

  const unitDemos: UnitDemo[] = [
    { title: 'Month', panel: 'month', granularity: 'month' },
    { title: 'Quarter', panel: 'quarter', granularity: 'quarter' },
    { title: 'Year', panel: 'year', granularity: 'year' },
  ]

  type DemoSectionProps = {
    title: string
    description: string
    children: Snippet
  }
</script>

{#snippet DemoSection({ title, description, children }: DemoSectionProps)}
  <Card {title} {description}>
    {@render children()}
  </Card>
{/snippet}

{#snippet DemoHeader()}
  <CalendarHeader class="mb-space-md">
    {#snippet children({ viewDate, panel })}
      <div class="flex flex-wrap items-center justify-between gap-space-md">
        <div>
          <div class="text-sm font-medium text-foreground">{viewDate.year} 年 {viewDate.month} 月</div>
          <div class="text-xs text-muted-foreground">panel: {panel}</div>
        </div>
        <div class="flex items-center gap-space-sm">
          <CalendarNavigationButton action="previous-year" aria-label="上一年" class="size-8 rounded-md border border-border text-sm hover:border-focus hover:bg-muted-background">«</CalendarNavigationButton>
          <CalendarNavigationButton action="previous-month" aria-label="上一月" class="size-8 rounded-md border border-border text-sm hover:border-focus hover:bg-muted-background">‹</CalendarNavigationButton>
          <CalendarNavigationButton action="next-month" aria-label="下一月" class="size-8 rounded-md border border-border text-sm hover:border-focus hover:bg-muted-background">›</CalendarNavigationButton>
          <CalendarNavigationButton action="next-year" aria-label="下一年" class="size-8 rounded-md border border-border text-sm hover:border-focus hover:bg-muted-background">»</CalendarNavigationButton>
        </div>
      </div>
    {/snippet}
  </CalendarHeader>
{/snippet}

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-5xl space-y-space-xl">
    <header class="space-y-space-xl">
      <a class="text-sm text-muted-foreground hover:text-foreground" href="/">返回首页</a>
      <div>
        <h1 class="text-2xl font-semibold text-foreground">Calendar</h1>
        <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
          基于 Temporal 的 Calendar core 和 Svelte primitive。当前只展示基础网格、粒度、禁用日期和自定义 cell 内容，不包含 ui 封装。
        </p>
      </div>
    </header>

    <div class="space-y-space-xl">
      {@render DemoSection({ title: 'Date', description: '日期面板支持受控值、禁用区间和自定义单元格内容。', children: dateDemo })}
      {@render DemoSection({ title: 'Week', description: '周粒度会把同一行日期映射到同一个 week value，供 WeekPicker 复用。', children: weekDemo })}
      {@render DemoSection({ title: 'Month / Quarter / Year', description: '月份、季度、年份作为独立粒度，不用日期值冒充。', children: unitDemo })}
    </div>
  </div>
</main>

{#snippet dateDemo()}
  <CalendarRoot
    value={dateValue}
    defaultViewDate={july}
    {today}
    min={minDate}
    max={maxDate}
    onValueChange={(value) => (dateValue = value)}
  >
    {@render DemoHeader()}
    <CalendarWeekHeader class="mb-space-sm grid grid-cols-7 gap-space-sm text-center text-xs text-muted-foreground" />
    <CalendarGrid class="grid gap-space-sm [&_[data-slot=calendar-row]]:grid [&_[data-slot=calendar-row]]:grid-cols-7 [&_[data-slot=calendar-row]]:gap-space-sm">
      {#snippet children(cell)}
        <CalendarCell {cell} class={getCellClassName(cell)}>
          <span class={getContentClassName(cell)}>
            <span class={getDateLabelClassName(cell)}>{cell.label}</span>
            {#if getScheduleLabel(cell)}
              <span class="mt-space-xs block h-4 text-xs leading-4 opacity-80">{getScheduleLabel(cell)}</span>
            {/if}
          </span>
        </CalendarCell>
      {/snippet}
    </CalendarGrid>
    <p class="mt-space-md text-sm text-muted-foreground">当前值：{dateValue ? getCalendarValueKey(dateValue) : '未选择'}</p>
  </CalendarRoot>
{/snippet}

{#snippet weekDemo()}
  <CalendarRoot granularity="week" defaultViewDate={july} {today} value={weekValue} onValueChange={(value) => (weekValue = value)}>
    <CalendarWeekHeader class="mb-space-sm grid grid-cols-7 gap-space-sm text-center text-xs text-muted-foreground" />
    <CalendarGrid class="grid gap-space-sm [&_[data-slot=calendar-row]]:grid [&_[data-slot=calendar-row]]:grid-cols-7 [&_[data-slot=calendar-row]]:gap-space-sm">
      {#snippet children(cell)}
        <CalendarCell {cell} class={getCellClassName(cell)}>
          <span class={getContentClassName(cell)}>
            <span class={getDateLabelClassName(cell)}>{cell.label}</span>
          </span>
        </CalendarCell>
      {/snippet}
    </CalendarGrid>
    <p class="mt-space-md text-sm text-muted-foreground">当前周：{weekValue ? getCalendarValueKey(weekValue) : '未选择'}</p>
  </CalendarRoot>
{/snippet}

{#snippet unitDemo()}
  <div class="grid gap-space-xl lg:grid-cols-3">
    {#each unitDemos as item}
      <div class="min-w-0 flex-1">
        <h3 class="mb-space-md text-sm font-medium text-foreground">{item.title}</h3>
        <CalendarRoot
          defaultViewDate={july}
          defaultPanel={item.panel}
          granularity={item.granularity}
          value={item.title === 'Month' ? monthValue : item.title === 'Quarter' ? quarterValue : yearValue}
          disabledDate={(date) => item.granularity === 'year' && compareCalendarDate(date, minYearPanelDate) < 0}
          onValueChange={(value) => {
            if (item.title === 'Month') monthValue = value
            if (item.title === 'Quarter') quarterValue = value
            if (item.title === 'Year') yearValue = value
          }}
        >
          <CalendarGrid class="grid gap-space-sm [&_[data-slot=calendar-row]]:grid [&_[data-slot=calendar-row]]:grid-cols-4 [&_[data-slot=calendar-row]]:gap-space-sm">
            {#snippet children(cell)}
              <CalendarCell {cell} class={getCellClassName(cell)}>
                <span class={getContentClassName(cell)}>
                  <span class={getDateLabelClassName(cell)}>{cell.label}</span>
                </span>
              </CalendarCell>
            {/snippet}
          </CalendarGrid>
        </CalendarRoot>
        <p class="mt-space-md text-xs text-muted-foreground">
          {item.title === 'Month' && monthValue ? getCalendarValueKey(monthValue) : item.title === 'Quarter' && quarterValue ? getCalendarValueKey(quarterValue) : item.title === 'Year' && yearValue ? getCalendarValueKey(yearValue) : '未选择'}
        </p>
      </div>
    {/each}
  </div>
{/snippet}
