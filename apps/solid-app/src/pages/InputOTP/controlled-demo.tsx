import type { InputOTPValue } from '@fex-design/core/input-otp/types'
import { InputOTPGroup,InputOTPInput,InputOTPRoot } from '@fex-design/solid/primitive/input-otp'
import Button from '@fex-design/solid/ui/button'
import Card from '@fex-design/solid/ui/card'
import { createSignal,For } from 'solid-js'
export function ControlledDemo(){const [value,setValue]=createSignal<InputOTPValue>(['AB','','']);return <Card title="受控值" description="外部状态可以更新或清空所有输入段。"><div class="grid gap-space-md"><InputOTPRoot value={value()} onChange={setValue}><InputOTPGroup><For each={[0,1,2]}>{(index)=><InputOTPInput index={index} maxLength={2} class="w-14" aria-label={`受控输入第 ${index+1} 段`}/>}</For></InputOTPGroup></InputOTPRoot><p class="text-sm text-muted-foreground">分段值：{JSON.stringify(value())}</p><Button class="w-fit" variant="outline" onClick={()=>setValue(['','',''])}>清空</Button></div></Card>}
