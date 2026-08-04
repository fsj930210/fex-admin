import { getRangePanelViewDates } from '@fex-design/core/date-picker/panel'
import { datePickerPanelsClassName } from '@fex-design/styles/date-picker'
import { cn } from '@fex/utils'
import { createMemo, For, splitProps, type JSX, type ParentProps } from 'solid-js'
import { useRangePickerContext } from './context'
import { RangePickerPanel } from './date-picker-panel'

export interface RangePickerPanelGroupProps extends ParentProps<
  JSX.HTMLAttributes<HTMLDivElement>
> {
  panelCount?: 1 | 2
}

export function RangePickerPanelGroup(props: RangePickerPanelGroupProps) {
  const [local, rest] = splitProps(props, ['class', 'children', 'panelCount', 'onMouseLeave'])
  const context = useRangePickerContext('RangePickerPanelGroup')
  const dates = createMemo(() => getRangePanelViewDates(context.viewDate(), context.panel()))
  const visibleDates = createMemo(() => (local.panelCount === 1 ? [dates()[0]] : dates()))
  return (
    <div
      {...rest}
      class={cn(datePickerPanelsClassName, local.class)}
      onMouseLeave={(event) => {
        if (typeof local.onMouseLeave === 'function') local.onMouseLeave(event)
        if (!event.defaultPrevented) context.setHoverValue(null)
      }}
    >
      {local.children ?? (
        <For each={visibleDates()}>{(date) => <RangePickerPanel panelViewDate={date} />}</For>
      )}
    </div>
  )
}
