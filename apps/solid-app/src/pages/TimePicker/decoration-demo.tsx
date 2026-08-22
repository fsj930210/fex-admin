import { CalendarIcon } from '@fex-design/solid/icon/calendar'
import { Card } from '@fex-design/solid/ui/card'
import { DemoTimePicker } from './demo-time-picker'
export function DecorationDemo() {
  return (
    <Card title="前后缀">
      <DemoTimePicker
        prefix={<span class="text-xs">开始</span>}
        suffix={<CalendarIcon class="size-4" />}
      />
    </Card>
  )
}
