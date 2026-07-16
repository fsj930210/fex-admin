import {
  compareCalendarDate,
  createCalendarDate,
  getCalendarValueKey,
  type CalendarValue,
} from '@fex/components-core/calendar'
import {
  CalendarCell,
  CalendarGrid,
  CalendarHeader,
  CalendarNavigationButton,
  CalendarRoot,
  CalendarWeekHeader,
  type CalendarCell as CalendarCellModel,
} from '@fex/components-react/primitive/calendar'
import { Card } from '@fex/components-react/ui/card'
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'

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

function DemoSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <Card title={title} description={description}>
      {children}
    </Card>
  )
}

function DemoHeader() {
  return (
    <CalendarHeader className="mb-space-md">
      {({ viewDate, panel }) => (
        <div className="flex flex-wrap items-center justify-between gap-space-md">
          <div>
            <div className="text-sm font-medium text-foreground">
              {viewDate.year} 年 {viewDate.month} 月
            </div>
            <div className="text-xs text-muted-foreground">panel: {panel}</div>
          </div>
          <div className="flex items-center gap-space-sm">
            <CalendarNavigationButton
              action="previous-year"
              aria-label="上一年"
              className="size-8 rounded-md border border-border text-sm hover:bg-muted-background"
            >
              «
            </CalendarNavigationButton>
            <CalendarNavigationButton
              action="previous-month"
              aria-label="上一月"
              className="size-8 rounded-md border border-border text-sm hover:bg-muted-background"
            >
              ‹
            </CalendarNavigationButton>
            <CalendarNavigationButton
              action="next-month"
              aria-label="下一月"
              className="size-8 rounded-md border border-border text-sm hover:bg-muted-background"
            >
              ›
            </CalendarNavigationButton>
            <CalendarNavigationButton
              action="next-year"
              aria-label="下一年"
              className="size-8 rounded-md border border-border text-sm hover:bg-muted-background"
            >
              »
            </CalendarNavigationButton>
          </div>
        </div>
      )}
    </CalendarHeader>
  )
}

function getCellClassName(cell: CalendarCellModel) {
  return [
    'flex min-h-14 items-center justify-center rounded-md p-space-xs text-center text-sm',
    cell.state.disabled ? 'cursor-not-allowed opacity-40' : '',
    cell.state.outside && !cell.state.selected ? 'text-muted-foreground' : 'text-foreground',
  ].join(' ')
}

function getDateCellContentClassName(cell: CalendarCellModel) {
  return [
    'inline-flex h-16 w-20 flex-col items-center justify-center rounded-md border px-space-sm py-space-xs transition-colors',
    cell.state.selected ? 'bg-foreground text-background shadow-sm' : '',
    cell.state.today && !cell.state.selected ? 'border-primary' : 'border-transparent',
    !cell.state.disabled && !cell.state.selected ? 'hover:bg-muted-background' : '',
  ].join(' ')
}

function getDateLabelClassName(_cell: CalendarCellModel) {
  return 'font-medium'
}

function getScheduleLabel(cell: CalendarCellModel) {
  return scheduleMap.get(getCalendarValueKey(cell.value))
}

function DateCalendarDemo() {
  const [value, setValue] = useState<CalendarValue | null>(today)

  return (
    <CalendarRoot
      value={value}
      defaultViewDate={july}
      today={today}
      min={minDate}
      max={maxDate}
      onValueChange={setValue}
    >
      <DemoHeader />
      <CalendarWeekHeader className="mb-space-sm grid grid-cols-7 gap-space-sm text-center text-xs text-muted-foreground" />
      <CalendarGrid className="grid gap-space-sm [&_[data-slot=calendar-row]]:grid [&_[data-slot=calendar-row]]:grid-cols-7 [&_[data-slot=calendar-row]]:gap-space-sm">
        {(cell) => (
          <CalendarCell key={cell.key} cell={cell} className={getCellClassName(cell)}>
            <span className={getDateCellContentClassName(cell)}>
              <span className={getDateLabelClassName(cell)}>{cell.label}</span>
              {getScheduleLabel(cell) ? (
                <span className="mt-space-xs block h-4 text-xs leading-4 opacity-80">
                  {getScheduleLabel(cell)}
                </span>
              ) : null}
            </span>
          </CalendarCell>
        )}
      </CalendarGrid>
      <p className="mt-space-md text-sm text-muted-foreground">
        当前值：{value ? getCalendarValueKey(value) : '未选择'}
      </p>
    </CalendarRoot>
  )
}

function WeekCalendarDemo() {
  const [value, setValue] = useState<CalendarValue | null>(null)

  return (
    <CalendarRoot
      granularity="week"
      defaultViewDate={july}
      today={today}
      value={value}
      onValueChange={setValue}
    >
      <CalendarWeekHeader className="mb-space-sm grid grid-cols-7 gap-space-sm text-center text-xs text-muted-foreground" />
      <CalendarGrid className="grid gap-space-sm [&_[data-slot=calendar-row]]:grid [&_[data-slot=calendar-row]]:grid-cols-7 [&_[data-slot=calendar-row]]:gap-space-sm">
        {(cell) => (
          <CalendarCell key={cell.key} cell={cell} className={getCellClassName(cell)}>
            <span className={getDateCellContentClassName(cell)}>
              <span className={getDateLabelClassName(cell)}>{cell.label}</span>
            </span>
          </CalendarCell>
        )}
      </CalendarGrid>
      <p className="mt-space-md text-sm text-muted-foreground">
        当前周：{value ? getCalendarValueKey(value) : '未选择'}
      </p>
    </CalendarRoot>
  )
}

function UnitPanelDemo({
  title,
  panel,
  granularity,
}: {
  title: string
  panel: 'month' | 'quarter' | 'year'
  granularity: 'month' | 'quarter' | 'year'
}) {
  const [value, setValue] = useState<CalendarValue | null>(null)

  return (
    <div className="min-w-0 flex-1">
      <h3 className="mb-space-md text-sm font-medium text-foreground">{title}</h3>
      <CalendarRoot
        defaultViewDate={july}
        defaultPanel={panel}
        granularity={granularity}
        value={value}
        onValueChange={setValue}
        disabledDate={(date) =>
          granularity === 'year' && compareCalendarDate(date, minYearPanelDate) < 0
        }
      >
        <CalendarGrid className="grid gap-space-sm [&_[data-slot=calendar-row]]:grid [&_[data-slot=calendar-row]]:grid-cols-4 [&_[data-slot=calendar-row]]:gap-space-sm">
          {(cell) => (
            <CalendarCell key={cell.key} cell={cell} className={getCellClassName(cell)}>
              <span className={getDateCellContentClassName(cell)}>
                <span className={getDateLabelClassName(cell)}>{cell.label}</span>
              </span>
            </CalendarCell>
          )}
        </CalendarGrid>
      </CalendarRoot>
      <p className="mt-space-md text-xs text-muted-foreground">
        {value ? getCalendarValueKey(value) : '未选择'}
      </p>
    </div>
  )
}

export function CalendarPage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-xl">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
            返回首页
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Calendar</h1>
            <p className="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
              基于 Temporal 的 Calendar core 和 React
              primitive。当前只展示基础网格、粒度、禁用日期和自定义 cell 内容，不包含 ui 封装。
            </p>
          </div>
        </header>

        <div className="space-y-space-xl">
          <DemoSection title="Date" description="日期面板支持受控值、禁用区间和自定义单元格内容。">
            <DateCalendarDemo />
          </DemoSection>

          <DemoSection
            title="Week"
            description="周粒度会把同一行日期映射到同一个 week value，供 WeekPicker 复用。"
          >
            <WeekCalendarDemo />
          </DemoSection>

          <DemoSection
            title="Month / Quarter / Year"
            description="月份、季度、年份作为独立粒度，不用日期值冒充。"
          >
            <div className="grid gap-space-xl lg:grid-cols-3">
              <UnitPanelDemo title="Month" panel="month" granularity="month" />
              <UnitPanelDemo title="Quarter" panel="quarter" granularity="quarter" />
              <UnitPanelDemo title="Year" panel="year" granularity="year" />
            </div>
          </DemoSection>
        </div>
      </div>
    </main>
  )
}
