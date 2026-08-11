import { InputOTPGroup, InputOTPInput, InputOTPRoot, InputOTPSeparator } from '@fex-design/react/primitive/input-otp'
import { Card } from '@fex-design/react/ui/card'

export function MixedRulesDemo() {
  return <Card title="分段输入规则" description="左侧仅接受 3 位字母并自动转为大写，右侧仅接受 4 位数字。">
    <InputOTPRoot>
      <InputOTPGroup><InputOTPInput index={0} maxLength={3} className="w-16" transform={(value) => value.toUpperCase()} accept={(value) => /^[A-Z]*$/.test(value)} aria-label="字母前缀" /></InputOTPGroup>
      <InputOTPSeparator>-</InputOTPSeparator>
      <InputOTPGroup><InputOTPInput index={1} maxLength={4} className="w-20" inputMode="numeric" accept={(value) => /^\d*$/.test(value)} aria-label="数字后缀" /></InputOTPGroup>
    </InputOTPRoot>
  </Card>
}
