<script lang="ts">
  import InputOTPRoot from '@fex-design/svelte/primitive/input-otp'
  import InputOTPGroup from '@fex-design/svelte/primitive/input-otp-group'
  import InputOTPInput from '@fex-design/svelte/primitive/input-otp-input'
  import InputOTPSeparator from '@fex-design/svelte/primitive/input-otp-separator'
  import Card from '@fex-design/svelte/ui/card'
  const uppercase=(value:string)=>value.toUpperCase(); const letters=(value:string)=>/^[A-Z]*$/.test(value); const digits=(value:string)=>/^\d*$/.test(value)
</script>
<Card title="分段输入规则" description="左侧仅接受 3 位字母并自动转为大写，右侧仅接受 4 位数字。"><InputOTPRoot><InputOTPGroup><InputOTPInput index={0} maxLength={3} class="w-16" transform={uppercase} accept={letters} aria-label="字母前缀"/></InputOTPGroup><InputOTPSeparator>-</InputOTPSeparator><InputOTPGroup><InputOTPInput index={1} maxLength={4} class="w-20" inputmode="numeric" accept={digits} aria-label="数字后缀"/></InputOTPGroup></InputOTPRoot></Card>
