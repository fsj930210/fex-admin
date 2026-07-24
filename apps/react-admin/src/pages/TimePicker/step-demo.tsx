import { Card } from '@fex/components-react/ui/card'
import { DemoTimePicker } from './demo-time-picker'
export function StepDemo() { return <Card title="步长" description="每个专用 Column 独立接收 step。"><DemoTimePicker step={{ hour: 2, minute: 5, second: 10 }} /></Card> }
