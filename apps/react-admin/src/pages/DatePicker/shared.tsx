import type { CalendarRange, CalendarValue } from '@fex/components-core/calendar'
import { formatDatePickerValue } from '@fex/components-core/date-picker/value'
import {
  DatePickerContent,
  DatePickerCancel,
  DatePickerConfirm,
  DatePickerFooter,
  DatePickerPanel,
  DatePickerToday,
  DatePickerRoot,
  DatePickerTrigger,
  RangePickerContent,
  RangePickerPanelGroup,
  RangePickerRoot,
  RangePickerTrigger,
  type DatePickerRootProps,
  type DatePickerTriggerProps,
  type RangePickerRootProps,
  type RangePickerTriggerProps,
} from '@fex/components-react/primitive/date-picker'
import { Card } from '@fex/components-react/ui/card'
import type { ReactNode } from 'react'

export function DemoSection({
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
      <div className="flex min-w-0 flex-wrap items-start gap-space-md">{children}</div>
    </Card>
  )
}

export function DemoDatePicker({
  triggerProps,
  footer,
  children,
  ...props
}: DatePickerRootProps & {
  triggerProps?: DatePickerTriggerProps
  footer?: ReactNode
}) {
  return (
    <DatePickerRoot {...props}>
      <DatePickerTrigger className="w-56" {...triggerProps} />
      <DatePickerContent className="overflow-hidden p-0">
        {children ?? <DatePickerPanel />}
        {footer}
      </DatePickerContent>
    </DatePickerRoot>
  )
}

export function DemoRangePicker({
  triggerProps,
  footer,
  children,
  panelCount,
  ...props
}: RangePickerRootProps & {
  triggerProps?: RangePickerTriggerProps
  footer?: ReactNode
  panelCount?: 1 | 2
}) {
  return (
    <RangePickerRoot {...props}>
      <RangePickerTrigger className="w-80" {...triggerProps} />
      <RangePickerContent className="overflow-hidden p-0">
        {children ?? <RangePickerPanelGroup panelCount={panelCount} />}
        {footer}
      </RangePickerContent>
    </RangePickerRoot>
  )
}

export function ConfirmFooter() {
  return (
    <DatePickerFooter>
      <DatePickerToday />
      <DatePickerCancel>
        取消
      </DatePickerCancel>
      <DatePickerConfirm>确定</DatePickerConfirm>
    </DatePickerFooter>
  )
}

export function ValuePreview({ value }: { value: CalendarValue | readonly CalendarValue[] | null }) {
  const text = isCalendarValueArray(value)
    ? value.map((item) => formatDatePickerValue(item, { picker: 'date' })).join(', ')
    : formatDatePickerValue(value, { picker: 'date' })
  return <p className="mt-space-sm w-full text-xs text-muted-foreground">当前值：{text || '未选择'}</p>
}

function isCalendarValueArray(value: unknown): value is readonly CalendarValue[] {
  return Array.isArray(value)
}

export function RangePreview({ value }: { value: CalendarRange }) {
  const start = formatDatePickerValue(value.start, { picker: 'date' })
  const end = formatDatePickerValue(value.end, { picker: 'date' })
  return <p className="mt-space-sm w-full text-xs text-muted-foreground">当前范围：{start || '空'} ~ {end || '空'}</p>
}
