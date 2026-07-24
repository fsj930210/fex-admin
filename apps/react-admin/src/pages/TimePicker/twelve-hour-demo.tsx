import { Card } from '@fex/components-react/ui/card'
import { DemoTimePicker } from './demo-time-picker'
export function TwelveHourDemo() { return <Card title="12 小时制" description="use12Hours 明确控制小时制，内部值始终是 24 小时。"><DemoTimePicker use12Hours defaultValue={{ hour: 14, minute: 25, second: 36 }} /></Card> }
