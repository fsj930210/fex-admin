<script lang="ts">
  import InputOTPRoot from '@fex-design/svelte/primitive/input-otp'
  import InputOTPGroup from '@fex-design/svelte/primitive/input-otp-group'
  import InputOTPInput from '@fex-design/svelte/primitive/input-otp-input'
  import InputOTPSeparator from '@fex-design/svelte/primitive/input-otp-separator'
  import Card from '@fex-design/svelte/ui/card'
</script>
<Card title="单字符验证码" description="每个输入框填满后才自动聚焦下一段。"><InputOTPRoot><InputOTPGroup>{#each [0,1,2] as index}<InputOTPInput {index} maxLength={1} inputmode="numeric" aria-label={`第 ${index+1} 位`}/>{/each}</InputOTPGroup><InputOTPSeparator/><InputOTPGroup>{#each [3,4,5] as index}<InputOTPInput {index} maxLength={1} inputmode="numeric" aria-label={`第 ${index+1} 位`}/>{/each}</InputOTPGroup></InputOTPRoot></Card>
