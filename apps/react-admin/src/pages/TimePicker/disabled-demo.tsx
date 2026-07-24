import { Card } from '@fex/components-react/ui/card'
import { DemoTimePicker } from './demo-time-picker'
export function DisabledDemo() { return <Card title="禁用与校验样式" description="disabled 阻止交互；invalid 只展示外部校验状态。"><div className="flex gap-space-lg"><DemoTimePicker disabled defaultValue={{ hour: 8, minute: 0, second: 0 }} /><DemoTimePicker invalid /></div></Card> }
