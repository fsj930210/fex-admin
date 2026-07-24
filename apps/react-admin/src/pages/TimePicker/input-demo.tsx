import { Card } from '@fex/components-react/ui/card'
import { DemoTimePicker } from './demo-time-picker'
export function InputDemo() { return <Card title="输入定位" description="聚焦打开面板，输入合法时间后对应时分秒自动置顶。"><DemoTimePicker defaultValue={{ hour: 2, minute: 25, second: 36 }} /></Card> }
