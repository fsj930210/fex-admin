import { Card } from '@fex/components-react/ui/card'
import { DemoTimePicker } from './demo-time-picker'
export function FormatDemo() { return <Card title="Format 决定列" description="HH:mm 渲染两列，HH:mm:ss 渲染三列。"><div className="flex flex-wrap gap-space-lg"><DemoTimePicker format="HH:mm" /><DemoTimePicker format="HH:mm:ss" /></div></Card> }
