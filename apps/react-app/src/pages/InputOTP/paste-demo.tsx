import type { InputOTPValue } from '@fex-design/core/input-otp/types'
import { InputOTPGroup, InputOTPInput, InputOTPRoot } from '@fex-design/react/primitive/input-otp'
import { Card } from '@fex-design/react/ui/card'
import { useState } from 'react'

export function PasteDemo() {
  const [value, setValue] = useState<InputOTPValue>(['', '', ''])
  return <Card title="跨段粘贴" description="可从任意输入框开始粘贴，内容会按后续分段容量依次分配。">
    <div className="grid gap-space-md">
      <InputOTPRoot onChange={setValue}>
        <InputOTPGroup>{[0, 1, 2].map((index) => <InputOTPInput key={index} index={index} maxLength={3} className="w-16" aria-label={`第 ${index + 1} 段`} />)}</InputOTPGroup>
      </InputOTPRoot>
      <p className="text-sm text-muted-foreground">分段值：{JSON.stringify(value)}</p>
    </div>
  </Card>
}
