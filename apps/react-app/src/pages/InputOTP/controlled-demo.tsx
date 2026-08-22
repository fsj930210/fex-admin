import type { InputOTPValue } from '@fex-design/core/input-otp/types'
import { InputOTPGroup, InputOTPInput, InputOTPRoot } from '@fex-design/react/primitive/input-otp'
import { Button } from '@fex-design/react/ui/button'
import { Card } from '@fex-design/react/ui/card'
import { useState } from 'react'
export function ControlledDemo(){const [value,setValue]=useState<InputOTPValue>(['AB','','']);return <Card title="受控值" description="外部状态可以更新或清空所有输入段。"><div className="grid gap-space-md"><InputOTPRoot value={value} onChange={setValue}><InputOTPGroup>{[0,1,2].map((index)=><InputOTPInput key={index} index={index} maxLength={2} className="w-14" aria-label={`受控输入第 ${index+1} 段`}/>)}</InputOTPGroup></InputOTPRoot><p className="text-sm text-muted-foreground">分段值：{JSON.stringify(value)}</p><Button className="w-fit" variant="outline" onClick={()=>setValue(['','',''])}>清空</Button></div></Card>}
