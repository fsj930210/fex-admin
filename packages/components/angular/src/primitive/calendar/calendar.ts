import {
  addDate,
  createCalendarGrid,
  getCalendarToday,
  subtractDate,
  type CalendarCell,
  type CalendarDate,
  type CalendarGranularity,
  type CalendarPanel,
  type CalendarValue,
  type CalendarWeekday,
} from '@fex/components-core/calendar'
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  output,
  signal,
  TemplateRef,
} from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'

export type CalendarNavigationAction =
  | 'previous-year'
  | 'previous-month'
  | 'next-month'
  | 'next-year'
  | 'previous-panel'
  | 'next-panel'

@Component({
  selector: 'fex-calendar-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'calendar-root',
    '[attr.data-panel]': 'currentPanel()',
    '[attr.data-granularity]': 'granularity()',
  },
  templateUrl: './calendar-root.html',
})
export class CalendarRoot {
  value = input<CalendarValue | null | undefined>()
  defaultValue = input<CalendarValue | null>(null)
  viewDate = input<CalendarDate | undefined>()
  defaultViewDate = input<CalendarDate>(getCalendarToday())
  panel = input<CalendarPanel | undefined>()
  defaultPanel = input<CalendarPanel>('date')
  granularity = input<CalendarGranularity>('date')
  weekStartsOn = input<CalendarWeekday>(0)
  today = input<CalendarDate | undefined>()
  min = input<CalendarDate | undefined>()
  max = input<CalendarDate | undefined>()
  disabledDate = input<((date: CalendarDate) => boolean) | undefined>()

  valueChange = output<CalendarValue>()
  viewDateChange = output<CalendarDate>()
  panelChange = output<CalendarPanel>()

  private readonly internalValue = signal<CalendarValue | null | undefined>(undefined)
  private readonly internalViewDate = signal<CalendarDate | undefined>(undefined)
  private readonly internalPanel = signal<CalendarPanel | undefined>(undefined)

  readonly currentValue = computed(() => this.value() ?? this.internalValue() ?? this.defaultValue())
  readonly currentViewDate = computed(
    () => this.viewDate() ?? this.internalViewDate() ?? this.defaultViewDate(),
  )
  readonly currentPanel = computed(() => this.panel() ?? this.internalPanel() ?? this.defaultPanel())
  readonly grid = computed(() => {
    const today = this.today()
    const min = this.min()
    const max = this.max()
    const disabledDate = this.disabledDate()
    const value = this.currentValue()

    return createCalendarGrid({
      viewDate: this.currentViewDate(),
      panel: this.currentPanel(),
      granularity: this.granularity(),
      weekStartsOn: this.weekStartsOn(),
      ...(today ? { today } : {}),
      ...(min ? { min } : {}),
      ...(max ? { max } : {}),
      ...(disabledDate ? { disabledDate } : {}),
      ...(value ? { value } : {}),
    })
  })

  setViewDate(viewDate: CalendarDate) {
    if (this.viewDate() === undefined) this.internalViewDate.set(viewDate)
    this.viewDateChange.emit(viewDate)
  }

  setPanel(panel: CalendarPanel) {
    if (this.panel() === undefined) this.internalPanel.set(panel)
    this.panelChange.emit(panel)
  }

  selectCell(cell: CalendarCell) {
    if (cell.state.disabled) return
    if (this.value() === undefined) this.internalValue.set(cell.value)
    this.valueChange.emit(cell.value)
  }
}

@Component({
  selector: 'fex-calendar-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'calendar-header' },
  templateUrl: './calendar-header.html',
})
export class CalendarHeader {
  constructor(readonly root: CalendarRoot) {}

  previousYear() {
    this.root.setViewDate(subtractDate(this.root.currentViewDate(), { years: 1 }))
  }

  previousMonth() {
    this.root.setViewDate(subtractDate(this.root.currentViewDate(), { months: 1 }))
  }

  nextMonth() {
    this.root.setViewDate(addDate(this.root.currentViewDate(), { months: 1 }))
  }

  nextYear() {
    this.root.setViewDate(addDate(this.root.currentViewDate(), { years: 1 }))
  }
}

@Component({
  selector: 'button[fexCalendarNavigationButton]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    type: 'button',
    'data-slot': 'calendar-navigation-button',
    '[attr.data-action]': 'action()',
    '(click)': 'runAction()',
  },
  template: '<ng-content />',
})
export class CalendarNavigationButton {
  action = input.required<CalendarNavigationAction>()

  constructor(private readonly root: CalendarRoot) {}

  runAction() {
    if (this.action() === 'previous-year')
      this.root.setViewDate(subtractDate(this.root.currentViewDate(), { years: 1 }))
    if (this.action() === 'previous-month')
      this.root.setViewDate(subtractDate(this.root.currentViewDate(), { months: 1 }))
    if (this.action() === 'next-month')
      this.root.setViewDate(addDate(this.root.currentViewDate(), { months: 1 }))
    if (this.action() === 'next-year')
      this.root.setViewDate(addDate(this.root.currentViewDate(), { years: 1 }))
    if (this.action() === 'previous-panel') {
      this.root.setViewDate(
        this.root.currentPanel() === 'date'
          ? subtractDate(this.root.currentViewDate(), { months: 1 })
          : subtractDate(this.root.currentViewDate(), { years: 1 }),
      )
    }
    if (this.action() === 'next-panel') {
      this.root.setViewDate(
        this.root.currentPanel() === 'date'
          ? addDate(this.root.currentViewDate(), { months: 1 })
          : addDate(this.root.currentViewDate(), { years: 1 }),
      )
    }
  }
}

@Component({
  selector: 'fex-calendar-week-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'calendar-week-header' },
  templateUrl: './calendar-week-header.html',
})
export class CalendarWeekHeader {
  labels = input<readonly string[]>(['日', '一', '二', '三', '四', '五', '六'])

  constructor(private readonly root: CalendarRoot) {}

  readonly orderedLabels = computed(() =>
    this.labels().map((_, index) => this.labels()[(index + this.root.weekStartsOn()) % 7] ?? ''),
  )
}

@Component({
  selector: 'fex-calendar-grid',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'calendar-grid' },
  templateUrl: './calendar-grid.html',
})
export class CalendarGrid {
  readonly cellTemplate =
    contentChild<TemplateRef<{ $implicit: CalendarCell; cell: CalendarCell }>>(TemplateRef)

  constructor(readonly root: CalendarRoot) {}

  rowKey(row: CalendarCell[]) {
    return row.map((cell) => cell.key).join('|')
  }
}

@Component({
  selector: 'button[fexCalendarCell]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    type: 'button',
    'data-slot': 'calendar-cell',
    '[attr.data-today]': "cell().state.today ? 'true' : null",
    '[attr.data-outside]': "cell().state.outside ? 'true' : null",
    '[attr.data-selected]': "cell().state.selected ? 'true' : null",
    '[attr.data-disabled]': "cell().state.disabled ? 'true' : null",
    '[disabled]': 'cell().state.disabled',
    '(click)': 'root.selectCell(cell())',
  },
  template: '<ng-content />',
})
export class CalendarCellButton {
  cell = input.required<CalendarCell>()
  compact = input(false, { transform: booleanAttribute })

  constructor(protected readonly root: CalendarRoot) {}
}
