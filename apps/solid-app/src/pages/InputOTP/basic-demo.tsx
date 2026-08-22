import { InputOTPGroup, InputOTPInput, InputOTPRoot, InputOTPSeparator } from '@fex-design/solid/primitive/input-otp'
import Card from '@fex-design/solid/ui/card'
import { For } from 'solid-js'
export function BasicDemo() { return <Card title="单字符验证码" description="每个输入框填满后才自动聚焦下一段。"><InputOTPRoot><InputOTPGroup><For each={[0,1,2]}>{(index) => <InputOTPInput index={index} maxLength={1} inputMode="numeric" aria-label={`第 ${index + 1} 位`}/>}</For></InputOTPGroup><InputOTPSeparator/><InputOTPGroup><For each={[3,4,5]}>{(index) => <InputOTPInput index={index} maxLength={1} inputMode="numeric" aria-label={`第 ${index + 1} 位`}/>}</For></InputOTPGroup></InputOTPRoot></Card> }
