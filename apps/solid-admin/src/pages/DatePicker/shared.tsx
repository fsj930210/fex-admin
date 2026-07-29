import type { CalendarRange, CalendarValue } from '@fex/components-core/calendar'
import { formatDatePickerValue } from '@fex/components-core/date-picker/value'
import {
  DatePickerContent,
  DatePickerPanel,
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
} from '@fex/components-solid/primitive/date-picker'
import Card from '@fex/components-solid/ui/card'
import { cn } from '@fex/utils'
import { splitProps, type JSX } from 'solid-js'

export function Section(props: { title: string; description: string; children: JSX.Element }) {
  return (
    <Card title={props.title} description={props.description}>
      <div class="flex min-w-0 flex-wrap items-start gap-space-md">{props.children}</div>
    </Card>
  )
}

export function DemoDatePicker(props: DatePickerRootProps & { triggerProps?: DatePickerTriggerProps; children?: JSX.Element; footer?: JSX.Element }) {
  const [local, rootProps] = splitProps(props, ['triggerProps', 'children', 'footer'])
  return (
    <DatePickerRoot {...rootProps}>
      <DatePickerTrigger {...local.triggerProps} class={cn('w-56', local.triggerProps?.class)} />
      <DatePickerContent class="overflow-hidden p-0">
        {local.children ?? <DatePickerPanel />}
        {local.footer}
      </DatePickerContent>
    </DatePickerRoot>
  )
}

export function DemoRangePicker(props: RangePickerRootProps & { triggerProps?: RangePickerTriggerProps; panelCount?: 1 | 2; children?: JSX.Element; footer?: JSX.Element }) {
  const [local, rootProps] = splitProps(props, ['triggerProps', 'panelCount', 'children', 'footer'])
  return (
    <RangePickerRoot {...rootProps}>
      <RangePickerTrigger {...local.triggerProps} class={cn('w-80', local.triggerProps?.class)} />
      <RangePickerContent class="overflow-hidden p-0">
        {local.children ?? <RangePickerPanelGroup panelCount={local.panelCount} />}
        {local.footer}
      </RangePickerContent>
    </RangePickerRoot>
  )
}

export function ValuePreview(props: { value: CalendarValue | readonly CalendarValue[] | null }) {
  const text = () => Array.isArray(props.value)
    ? props.value.map((item) => formatDatePickerValue(item, { picker: 'date' })).join(', ')
    : formatDatePickerValue(props.value, { picker: 'date' })
  return <p class="mt-space-sm w-full text-xs text-muted-foreground">当前值：{text() || '未选择'}</p>
}

export function RangePreview(props: { value: CalendarRange<CalendarValue> }) {
  const start = () => formatDatePickerValue(props.value.start, { picker: 'date' })
  const end = () => formatDatePickerValue(props.value.end, { picker: 'date' })
  return <p class="mt-space-sm w-full text-xs text-muted-foreground">当前范围：{start() || '空'} ~ {end() || '空'}</p>
}
