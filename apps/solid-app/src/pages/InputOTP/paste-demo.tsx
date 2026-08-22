import type { InputOTPValue } from '@fex-design/core/input-otp/types'
import { InputOTPGroup, InputOTPInput, InputOTPRoot } from '@fex-design/solid/primitive/input-otp'
import Card from '@fex-design/solid/ui/card'
import { createSignal, For } from 'solid-js'
export function PasteDemo() { const [value,setValue]=createSignal<InputOTPValue>(['','','']); return <Card title="跨段粘贴" description="可从任意输入框开始粘贴，内容会按后续分段容量依次分配。"><div class="grid gap-space-md"><InputOTPRoot onChange={setValue}><InputOTPGroup><For each={[0,1,2]}>{(index)=><InputOTPInput index={index} maxLength={3} class="w-16" aria-label={`第 ${index+1} 段`}/>}</For></InputOTPGroup></InputOTPRoot><p class="text-sm text-muted-foreground">分段值：{JSON.stringify(value())}</p></div></Card> }
