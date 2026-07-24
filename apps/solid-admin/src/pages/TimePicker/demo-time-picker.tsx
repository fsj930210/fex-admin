import { analyzeTimeFormat } from '@fex/components-core/date/utils'
import { TimePickerContent, TimePickerHourColumn, TimePickerMinuteColumn, TimePickerPanel, TimePickerPeriodColumn, TimePickerRoot, TimePickerSecondColumn, TimePickerTrigger, type DisabledTime, type TimeValue } from '@fex/components-solid/primitive/time-picker'
import { Button } from '@fex/components-solid/ui/button'
import { createMemo, createSignal, For, Show, type JSX } from 'solid-js'

export interface DemoTimePickerProps { value?: TimeValue | null; defaultValue?: TimeValue | null; onChange?: (value: TimeValue | null) => void; use12Hours?: boolean; format?: string; step?: { hour?: number; minute?: number; second?: number }; disabledTime?: DisabledTime; disabled?: boolean; invalid?: boolean; prefix?: JSX.Element; suffix?: JSX.Element; panelExtra?: JSX.Element }

export function DemoTimePicker(props: DemoTimePickerProps) {
  const [open, setOpen] = createSignal(false)
  const pattern = () => props.format ?? (props.use12Hours ? 'hh:mm:ss A' : 'HH:mm:ss')
  const columns = createMemo(() => analyzeTimeFormat(pattern(), props.use12Hours).columns)
  return <TimePickerRoot value={props.value} defaultValue={props.defaultValue} onChange={value => props.onChange?.(value)} open={open()} onOpenChange={setOpen} format={pattern()} use12Hours={props.use12Hours} disabled={props.disabled} disabledTime={props.disabledTime} placement="bottomLeft">
    <TimePickerTrigger class="w-56" invalid={props.invalid} prefix={props.prefix} suffix={props.suffix} inputProps={{ 'aria-label': 'Time' }} />
    <TimePickerContent>
      <TimePickerPanel><For each={columns()}>{column => column.unit === 'hour' ? <TimePickerHourColumn step={props.step?.hour} /> : column.unit === 'minute' ? <TimePickerMinuteColumn step={props.step?.minute} /> : column.unit === 'second' ? <TimePickerSecondColumn step={props.step?.second} /> : <TimePickerPeriodColumn />}</For></TimePickerPanel>
      <Show when={props.panelExtra}><div class="border-t border-border p-space-sm text-sm">{props.panelExtra}</div></Show>
      <div class="flex justify-end border-t border-border p-space-sm"><Button size="sm" variant="ghost" onClick={() => setOpen(false)}>确定</Button></div>
    </TimePickerContent>
  </TimePickerRoot>
}
