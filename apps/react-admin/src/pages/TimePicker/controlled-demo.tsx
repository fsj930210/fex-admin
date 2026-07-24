import { Card } from '@fex/components-react/ui/card'
import { useState } from 'react'
import { DemoTimePicker } from './demo-time-picker'
import type { TimeValue } from '@fex/components-react/primitive/time-picker'
export function ControlledDemo() { const [value, setValue] = useState<TimeValue | null>({ hour: 10, minute: 20, second: 30 }); return <Card title="受控与非受控" description="受控值由外部更新；非受控值由 primitive 保存。"><div className="flex flex-wrap gap-space-lg"><DemoTimePicker value={value} onChange={setValue} /><DemoTimePicker defaultValue={{ hour: 8, minute: 15, second: 0 }} /></div></Card> }
