import { Card } from '@fex/components-react/ui/card'
import { DemoTimePicker } from './demo-time-picker'
export function PanelExtraDemo() { return <Card title="面板附加内容" description="附加内容由组合层放置，primitive 不固化 footer。"><DemoTimePicker panelExtra={<button type="button" className="text-primary">选择当前时间</button>} /></Card> }
