import { analyzeTimeFormat } from '@fex/components-core/date/utils'
import {
  TimePickerContent,
  TimePickerHourColumn,
  TimePickerMinuteColumn,
  TimePickerPanel,
  TimePickerPeriodColumn,
  TimePickerRoot,
  TimePickerSecondColumn,
  TimePickerTrigger,
  type DisabledTime,
  type TimeValue,
} from '@fex/components-react/primitive/time-picker'
import { Button } from '@fex/components-react/ui/button'
import { useState, type ReactNode } from 'react'

export interface DemoTimePickerProps {
  value?: TimeValue | null
  defaultValue?: TimeValue | null
  onChange?: (value: TimeValue | null) => void
  use12Hours?: boolean
  format?: string
  step?: { hour?: number; minute?: number; second?: number }
  disabledTime?: DisabledTime
  disabled?: boolean
  invalid?: boolean
  prefix?: ReactNode
  suffix?: ReactNode
  panelExtra?: ReactNode
}

export function DemoTimePicker({
  value,
  defaultValue = null,
  onChange,
  use12Hours = false,
  format,
  step,
  disabledTime,
  disabled = false,
  invalid = false,
  prefix,
  suffix,
  panelExtra,
}: DemoTimePickerProps) {
  const [open, setOpen] = useState(false)
  const resolvedFormat = format ?? (use12Hours ? 'hh:mm:ss A' : 'HH:mm:ss')
  const columns = analyzeTimeFormat(resolvedFormat, use12Hours).columns

  return (
    <TimePickerRoot
      value={value}
      defaultValue={defaultValue}
      onChange={(next) => onChange?.(next)}
      open={open}
      onOpenChange={setOpen}
      format={resolvedFormat}
      use12Hours={use12Hours}
      disabled={disabled}
      disabledTime={disabledTime}
      placement="bottomLeft"
    >
      <TimePickerTrigger
        className="w-56"
        invalid={invalid}
        prefix={prefix}
        suffix={suffix}
        inputProps={{ 'aria-label': 'Time' }}
      />
      <TimePickerContent>
        <TimePickerPanel>
          {columns.map((column) => {
            if (column.unit === 'hour')
              return <TimePickerHourColumn key="hour" step={step?.hour} />
            if (column.unit === 'minute')
              return <TimePickerMinuteColumn key="minute" step={step?.minute} />
            if (column.unit === 'second')
              return <TimePickerSecondColumn key="second" step={step?.second} />
            return <TimePickerPeriodColumn key="period" />
          })}
        </TimePickerPanel>
        {panelExtra ? (
          <div className="border-t border-border p-space-sm text-sm">{panelExtra}</div>
        ) : null}
        <div className="flex justify-end border-t border-border p-space-sm">
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
            确定
          </Button>
        </div>
      </TimePickerContent>
    </TimePickerRoot>
  )
}
