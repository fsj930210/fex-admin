import { CalendarIcon } from '@fex/components-react/icon/calendar'
import { Card } from '@fex/components-react/ui/card'
import { DemoTimePicker } from './demo-time-picker'
export function DecorationDemo() { return <Card title="前后缀" description="复用 Input primitive 的 Prefix 和 Suffix。"><DemoTimePicker prefix={<span className="text-xs">开始</span>} suffix={<CalendarIcon className="size-4" />} /></Card> }
