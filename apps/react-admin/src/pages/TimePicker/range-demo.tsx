import { Card } from '@fex/components-react/ui/card'
import { DemoTimePicker } from './demo-time-picker'
export function RangeDemo() { return <Card title="范围选择" description="两个独立 primitive 由业务容器组合起止时间。"><div className="flex items-center gap-space-sm"><DemoTimePicker format="HH:mm" /><span>至</span><DemoTimePicker format="HH:mm" /></div></Card> }
