import { getRangePanelViewDates } from '@fex/components-core/date-picker/panel'
import { cn } from '@fex/utils'
import type { ComponentProps } from 'react'
import { useRangePickerContext } from './context'
import { RangePickerPanel } from './date-picker-panel'

export interface RangePickerPanelGroupProps extends ComponentProps<'div'> {
  panelCount?: 1 | 2 | undefined
}

export function RangePickerPanelGroup({ panelCount = 2, className, children, ...props }: RangePickerPanelGroupProps) {
  const context = useRangePickerContext('RangePickerPanelGroup')
  const viewDates = getRangePanelViewDates(context.viewDate, context.panel)
  const isDualPanelPicker = context.picker === 'date' || context.picker === 'week'
  const visiblePanelCount = isDualPanelPicker ? panelCount : 1

  return (
    <div {...props} data-slot="range-picker-panel-group" className={cn('flex divide-x divide-border', className)}>
      {children ?? (
        <>
          <RangePickerPanel panelViewDate={viewDates[0]} />
          {visiblePanelCount === 2 ? <RangePickerPanel panelViewDate={viewDates[1]} /> : null}
        </>
      )}
    </div>
  )
}
