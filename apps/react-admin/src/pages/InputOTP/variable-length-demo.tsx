import { InputOTPGroup, InputOTPInput, InputOTPRoot, InputOTPSeparator } from '@fex-design/react/primitive/input-otp'
import { Card } from '@fex-design/react/ui/card'

export function VariableLengthDemo() {
  return <Card title="多字符分段" description="每段可设置不同最大长度，填满前保持当前焦点。">
    <InputOTPRoot aria-label="Grouped account code">
      <InputOTPGroup><InputOTPInput index={0} maxLength={3} className="w-16" aria-label="银行代码" /><InputOTPInput index={1} maxLength={3} className="w-16" aria-label="分行代码" /></InputOTPGroup>
      <InputOTPSeparator>/</InputOTPSeparator>
      <InputOTPGroup><InputOTPInput index={2} maxLength={4} className="w-20" aria-label="账户前缀" /><InputOTPInput index={3} maxLength={4} className="w-20" aria-label="账户后缀" /></InputOTPGroup>
    </InputOTPRoot>
  </Card>
}
