<script lang="ts">
  import type { InputOTPValue } from '@fex-design/core/input-otp/types'
  import InputOTPRoot from '@fex-design/svelte/primitive/input-otp'
  import InputOTPGroup from '@fex-design/svelte/primitive/input-otp-group'
  import InputOTPInput from '@fex-design/svelte/primitive/input-otp-input'
  import Card from '@fex-design/svelte/ui/card'
  let value=$state<InputOTPValue>(['','',''])
</script>
<Card title="跨段粘贴" description="可从任意输入框开始粘贴，内容会按后续分段容量依次分配。"><div class="grid gap-space-md"><InputOTPRoot onChange={(next)=>value=next}><InputOTPGroup>{#each [0,1,2] as index}<InputOTPInput {index} maxLength={3} class="w-16" aria-label={`第 ${index+1} 段`}/>{/each}</InputOTPGroup></InputOTPRoot><p class="text-sm text-muted-foreground">分段值：{JSON.stringify(value)}</p></div></Card>
