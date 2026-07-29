import { getRangePanelViewDates } from '@fex/components-core/date-picker/panel'
import { datePickerPanelsClassName } from '@fex/components-styles/date-picker'
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

  return (
    <div {...props} data-slot="range-picker-panel-group" className={cn(datePickerPanelsClassName, className)}>
      {children ?? (
        <>
          <RangePickerPanel panelViewDate={viewDates[0]} />
          {panelCount === 2 ? <RangePickerPanel panelViewDate={viewDates[1]} /> : null}
        </>
      )}
    </div>
  )
}
