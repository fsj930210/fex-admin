<script lang="ts">
  import type { InputOTPValue } from '@fex-design/core/input-otp/types'
  import InputOTPRoot from '@fex-design/svelte/primitive/input-otp'
  import InputOTPGroup from '@fex-design/svelte/primitive/input-otp-group'
  import InputOTPInput from '@fex-design/svelte/primitive/input-otp-input'
  import Button from '@fex-design/svelte/ui/button'
  import Card from '@fex-design/svelte/ui/card'
  let value=$state<InputOTPValue>(['AB','',''])
</script>
<Card title="受控值" description="外部状态可以更新或清空所有输入段。"><div class="grid gap-space-md"><InputOTPRoot {value} onChange={(next)=>value=next}><InputOTPGroup>{#each [0,1,2] as index}<InputOTPInput {index} maxLength={2} class="w-14" aria-label={`受控输入第 ${index+1} 段`}/>{/each}</InputOTPGroup></InputOTPRoot><p class="text-sm text-muted-foreground">分段值：{JSON.stringify(value)}</p><Button class="w-fit" variant="outline" onclick={()=>value=['','','']}>清空</Button></div></Card>
