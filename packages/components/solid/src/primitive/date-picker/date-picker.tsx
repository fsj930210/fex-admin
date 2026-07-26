import {
  getCalendarToday,
  getCalendarValueDate,
  type CalendarCell,
  type CalendarDate,
  type CalendarPanel,
  type CalendarValue,
  type CalendarWeekday,
} from '@fex/components-core/calendar'
import { createDatePickerDisabledDate } from '@fex/components-core/date-picker/constraints'
import {
  getDefaultPanelByPicker,
  getGranularityByPicker,
} from '@fex/components-core/date-picker/panel'
import {
  formatDatePickerValue,
  normalizeDatePickerValue,
  parseDatePickerValue,
} from '@fex/components-core/date-picker/value'
import type { DatePickerPicker } from '@fex/components-core/date-picker/types'
import {
  datePickerCellClassName,
  datePickerContentClassName,
  datePickerFooterClassName,
  datePickerGridClassName,
  datePickerHeaderClassName,
  datePickerHeaderLabelClassName,
  datePickerHeaderNavigationClassName,
  datePickerPanelClassName,
  datePickerWeekHeaderClassName,
} from '@fex/components-styles/date-picker'
import { createMemo, createSignal, Show, splitProps, type JSX } from 'solid-js'
import { CalendarIcon } from '../../icon/calendar'
import { ChevronLeftIcon, ChevronRightIcon } from '../../icon/chevron'
import { CloseIcon } from '../../icon/close'
import Button from '../../ui/button/button'
import {
  CalendarCell as PrimitiveCalendarCell,
  CalendarGrid,
  CalendarHeader,
  CalendarRoot,
  CalendarWeekHeader,
} from '../calendar/calendar'
import { InputClear, InputControl, InputPrefix, InputRoot, InputSuffix } from '../input/input'
import { Popover, PopoverContent, PopoverPortal, PopoverTrigger } from '../popover/popover'
export { RangePicker, type RangePickerProps } from './range-picker'

export interface DatePickerProps {
  class?: string
  value?: CalendarValue | readonly CalendarValue[] | null
  defaultValue?: CalendarValue | readonly CalendarValue[] | null
  open?: boolean
  defaultOpen?: boolean
  picker?: DatePickerPicker
  multiple?: boolean
  needConfirm?: boolean
  disabled?: boolean
  readOnly?: boolean
  allowClear?: boolean
  placeholder?: string
  format?: string
  weekStartsOn?: CalendarWeekday
  minDate?: CalendarDate
  maxDate?: CalendarDate
  disabledDate?: (date: CalendarDate) => boolean
  prefix?: JSX.Element
  suffix?: JSX.Element
  footer?: (actions: {
    close: () => void
    clear: () => void
    confirm: () => void
    cancel: () => void
  }) => JSX.Element
  panel?: (actions: {
    close: () => void
    clear: () => void
    confirm: () => void
    cancel: () => void
  }) => JSX.Element
  onChange?: (value: CalendarValue | readonly CalendarValue[] | null) => void
  onOpenChange?: (open: boolean) => void
}

function isValueArray(
  value: CalendarValue | readonly CalendarValue[] | null | undefined,
): value is readonly CalendarValue[] {
  return Array.isArray(value)
}

export function DatePicker(props: DatePickerProps) {
  const [local] = splitProps(props, [
    'value',
    'defaultValue',
    'open',
    'defaultOpen',
    'picker',
    'multiple',
    'needConfirm',
    'disabled',
    'readOnly',
    'allowClear',
    'placeholder',
    'format',
    'weekStartsOn',
    'minDate',
    'maxDate',
    'disabledDate',
    'prefix',
    'suffix',
    'footer',
    'panel',
    'onChange',
    'onOpenChange',
    'class',
  ])
  const picker = () => local.picker ?? 'date'
  const multiple = () => local.multiple ?? false
  const needConfirm = () => local.needConfirm ?? multiple()
  const [localValue, setLocalValue] = createSignal<CalendarValue | readonly CalendarValue[] | null>(
    local.defaultValue ?? (multiple() ? [] : null),
  )
  const [localOpen, setLocalOpen] = createSignal(local.defaultOpen ?? false)
  const [pending, setPending] = createSignal<CalendarValue | readonly CalendarValue[] | null>(
    localValue(),
  )
  const [panel, setPanel] = createSignal<CalendarPanel>(getDefaultPanelByPicker(picker()))
  const [viewDate, setViewDate] = createSignal(getCalendarToday())
  const [text, setText] = createSignal('')
  const value = () => (local.value === undefined ? localValue() : local.value)
  const activeValue = () => (needConfirm() ? pending() : value())
  const displayValue = createMemo(() => {
    const current = value()
    return isValueArray(current)
      ? current
          .map((item) =>
            formatDatePickerValue(item, {
              picker: picker(),
              format: local.format,
              weekStartsOn: local.weekStartsOn,
            }),
          )
          .join(', ')
      : formatDatePickerValue(current, {
          picker: picker(),
          format: local.format,
          weekStartsOn: local.weekStartsOn,
        })
  })
  const inputValue = () => text() || displayValue()
  const disabledDate = () =>
    createDatePickerDisabledDate({
      picker: picker(),
      panel: panel(),
      ...(local.minDate ? { minDate: local.minDate } : {}),
      ...(local.maxDate ? { maxDate: local.maxDate } : {}),
      ...(local.disabledDate ? { disabledDate: local.disabledDate } : {}),
    })

  function setOpen(next: boolean) {
    if (local.open === undefined) setLocalOpen(next)
    if (next) setPending(value())
    if (!next) setPanel(getDefaultPanelByPicker(picker()))
    local.onOpenChange?.(next)
  }
  function close() {
    setOpen(false)
  }
  function commit(next: CalendarValue | readonly CalendarValue[] | null) {
    if (local.value === undefined) setLocalValue(next)
    setText('')
    local.onChange?.(next)
  }
  function clear() {
    const next = multiple() ? [] : null
    setPending(next)
    commit(next)
  }
  function confirm() {
    commit(pending())
    close()
  }
  function cancel() {
    setPending(value())
    close()
  }
  const actions = { close, clear, confirm, cancel }
  function select(next: CalendarValue) {
    if (multiple()) {
      const current = activeValue()
      const values = isValueArray(current) ? current : []
      const key = formatDatePickerValue(next, { picker: picker() })
      const selected = values.some(
        (item) => formatDatePickerValue(item, { picker: picker() }) === key,
      )
      const result = selected
        ? values.filter((item) => formatDatePickerValue(item, { picker: picker() }) !== key)
        : [...values, next]
      if (needConfirm()) setPending(result)
      else commit(result)
      return
    }
    if (needConfirm()) setPending(next)
    else {
      commit(next)
      close()
    }
  }
  function removeMultipleValue(item: CalendarValue) {
    const current = activeValue()
    const values = isValueArray(current) ? current : []
    const next = values.filter(
      (value) =>
        formatDatePickerValue(value, { picker: picker() }) !==
        formatDatePickerValue(item, { picker: picker() }),
    )
    setPending(next)
    commit(next)
  }
  function selectCell(cell: CalendarCell) {
    const date = getCalendarValueDate(cell.value)
    setViewDate(date)
    if (cell.panel === 'year' && picker() !== 'year') {
      setPanel(
        picker() === 'month' || picker() === 'quarter'
          ? getDefaultPanelByPicker(picker())
          : 'month',
      )
      return
    }
    if (cell.panel === 'month' && picker() !== 'month') {
      setPanel('date')
      return
    }
    select(normalizeDatePickerValue(date, picker(), local.weekStartsOn))
  }

  const calendarSelection = () => {
    const current = activeValue()
    return isValueArray(current) ? { value: null, values: current } : { value: current }
  }
  return (
    <Popover
      open={local.open ?? localOpen()}
      trigger={local.disabled ? [] : ['focus', 'click']}
      onOpenChange={setOpen}
    >
      <PopoverTrigger>
        {(trigger) => (
          <div
            {...(trigger.props as unknown as JSX.HTMLAttributes<HTMLDivElement>)}
            ref={trigger.ref as unknown as JSX.HTMLAttributes<HTMLDivElement>['ref']}
            class={local.class}
          >
            <InputRoot
              value={multiple() ? '' : inputValue()}
              disabled={local.disabled}
              readOnly={local.readOnly}
              onValueChange={(next) => {
                setText(next)
                if (!multiple()) {
                  const parsed = parseDatePickerValue(next, {
                    picker: picker(),
                    format: local.format,
                    weekStartsOn: local.weekStartsOn,
                  })
                  if (parsed.valid) select(parsed.value)
                }
              }}
              onClear={clear}
            >
              <Show when={local.prefix}>
                <InputPrefix>{local.prefix}</InputPrefix>
              </Show>
              <Show when={multiple() && isValueArray(value()) && value().length}>
                <div
                  data-slot="date-picker-tags"
                  class="flex min-w-0 flex-1 items-center gap-1 overflow-hidden px-2"
                >
                  <span
                    data-slot="date-picker-tag"
                    class="inline-flex shrink-0 items-center rounded bg-muted-background px-1.5 py-0.5 text-xs"
                  >
                    {formatDatePickerValue(value()[0]!, {
                      picker: picker(),
                      format: local.format,
                      weekStartsOn: local.weekStartsOn,
                    })}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      class="ml-1 text-muted-foreground"
                      onClick={(event) => {
                        event.stopPropagation()
                        removeMultipleValue(value()[0]!)
                      }}
                    >
                      <CloseIcon />
                    </Button>
                  </span>
                  <Show when={value().length > 1}>
                    <span
                      data-slot="date-picker-tag-overflow"
                      title={displayValue()}
                      class="inline-flex shrink-0 items-center rounded bg-muted-background px-1.5 py-0.5 text-xs text-muted-foreground"
                    >
                      +{value().length - 1}
                    </span>
                  </Show>
                </div>
              </Show>
              <InputControl
                class={
                  multiple() && isValueArray(value()) && value().length
                    ? 'w-8 min-w-8 flex-none px-1'
                    : undefined
                }
                placeholder={
                  multiple() && isValueArray(value()) && value().length
                    ? ''
                    : (local.placeholder ?? local.format ?? '请选择日期')
                }
              />
              <Show when={local.allowClear ?? true}>
                <InputClear />
              </Show>
              <Show when={!(local.allowClear ?? true) || !inputValue()}>
                <InputSuffix>{local.suffix ?? <CalendarIcon />}</InputSuffix>
              </Show>
            </InputRoot>
          </div>
        )}
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent class={datePickerContentClassName} data-slot="date-picker-content">
          <Show
            when={local.panel}
            fallback={
              <CalendarRoot
                class={datePickerPanelClassName}
                {...calendarSelection()}
                viewDate={viewDate()}
                panel={panel()}
                granularity={getGranularityByPicker(picker())}
                weekStartsOn={local.weekStartsOn ?? 0}
                disabledDate={disabledDate()}
                onCellSelect={selectCell}
                onViewDateChange={setViewDate}
                onPanelChange={setPanel}
              >
                <CalendarHeader>
                  {(header) => {
                    const datePanel = header.panel === 'date'
                    const yearPanel = header.panel === 'year' || header.panel === 'decade'
                    const step = yearPanel ? 10 : 1
                    return (
                      <div class={datePickerHeaderClassName}>
                        <div class="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            class={datePickerHeaderNavigationClassName}
                            onClick={() =>
                              setViewDate({ ...header.viewDate, year: header.viewDate.year - step })
                            }
                          >
                            <ChevronLeftIcon class="size-4" />
                            <ChevronLeftIcon class="-ml-2 size-4" />
                          </Button>
                          <Show when={datePanel}>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              class={datePickerHeaderNavigationClassName}
                              onClick={header.previousMonth}
                            >
                              <ChevronLeftIcon class="size-4" />
                            </Button>
                          </Show>
                        </div>
                        <div class="flex items-center gap-2 text-base font-semibold">
                          <Button
                            variant="ghost"
                            size="sm"
                            class={datePickerHeaderLabelClassName}
                            onClick={() => header.setPanel('year')}
                          >
                            {yearPanel && header.panel === 'decade'
                              ? `${Math.floor(header.viewDate.year / 10) * 10}-${Math.floor(header.viewDate.year / 10) * 10 + 9}年`
                              : `${header.viewDate.year}年`}
                          </Button>
                          <Show when={picker() !== 'year' && datePanel}>
                            <Button
                              variant="ghost"
                              size="sm"
                              class={datePickerHeaderLabelClassName}
                              onClick={() => header.setPanel('month')}
                            >
                              {header.viewDate.month}月
                            </Button>
                          </Show>
                        </div>
                        <div class="flex items-center gap-1">
                          <Show when={datePanel}>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              class={datePickerHeaderNavigationClassName}
                              onClick={header.nextMonth}
                            >
                              <ChevronRightIcon class="size-4" />
                            </Button>
                          </Show>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            class={datePickerHeaderNavigationClassName}
                            onClick={() =>
                              setViewDate({ ...header.viewDate, year: header.viewDate.year + step })
                            }
                          >
                            <ChevronRightIcon class="size-4" />
                            <ChevronRightIcon class="-ml-2 size-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  }}
                </CalendarHeader>
                <Show when={panel() === 'date'}>
                  <CalendarWeekHeader class={datePickerWeekHeaderClassName} />
                </Show>
                <CalendarGrid class={datePickerGridClassName} data-panel={panel()}>
                  {(cell) => <PrimitiveCalendarCell cell={cell} class={datePickerCellClassName} />}
                </CalendarGrid>
              </CalendarRoot>
            }
          >
            {local.panel?.(actions)}
          </Show>
          <Show
            when={local.footer}
            fallback={
              <Show when={needConfirm()}>
                <div class={datePickerFooterClassName}>
                  <Button type="button" variant="outline" onClick={cancel}>
                    取消
                  </Button>
                  <Button type="button" onClick={confirm}>
                    确认
                  </Button>
                </div>
              </Show>
            }
          >
            {local.footer?.(actions)}
          </Show>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  )
}

export {
  Popover as DatePickerRoot,
  PopoverTrigger as DatePickerTrigger,
  PopoverContent as DatePickerContent,
  Popover as RangePickerRoot,
  PopoverTrigger as RangePickerTrigger,
  PopoverContent as RangePickerContent,
} from '../popover/popover'
export {
  CalendarRoot as DatePickerPanel,
  CalendarHeader as DatePickerHeader,
  CalendarNavigationButton as DatePickerHeaderButton,
  CalendarWeekHeader as DatePickerWeekHeader,
  CalendarGrid as DatePickerGrid,
  CalendarCell as DatePickerCell,
  CalendarRoot as RangePickerPanel,
} from '../calendar/calendar'
export * from '@fex/components-core/date-picker/types'
export * from '@fex/components-core/date-picker/value'
export * from '@fex/components-core/date-picker/panel'
export * from '@fex/components-core/date-picker/range'
export * from '@fex/components-core/date-picker/constraints'
