import { InputOTPGroup, InputOTPInput, InputOTPRoot, InputOTPSeparator } from '@fex-design/react/primitive/input-otp'
import { Card } from '@fex-design/react/ui/card'

export function BasicDemo() {
  return <Card title="单字符验证码" description="每个输入框填满后才自动聚焦下一段。">
    <InputOTPRoot defaultValue={[]} aria-label="六位验证码">
      <InputOTPGroup>{[0, 1, 2].map((index) => <InputOTPInput key={index} index={index} maxLength={1} inputMode="numeric" aria-label={`第 ${index + 1} 位`} />)}</InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>{[3, 4, 5].map((index) => <InputOTPInput key={index} index={index} maxLength={1} inputMode="numeric" aria-label={`第 ${index + 1} 位`} />)}</InputOTPGroup>
    </InputOTPRoot>
  </Card>
}
