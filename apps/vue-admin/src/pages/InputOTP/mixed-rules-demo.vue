<script setup lang="ts">
import { InputOTPGroup, InputOTPInput, InputOTPRoot, InputOTPSeparator } from '@fex-design/vue/primitive/input-otp'
import Card from '@fex-design/vue/ui/card'
const uppercase = (value: string) => value.toUpperCase()
const letters = (value: string) => /^[A-Z]*$/.test(value)
const digits = (value: string) => /^\d*$/.test(value)
</script>
<template><Card title="分段输入规则" description="左侧仅接受 3 位字母并自动转为大写，右侧仅接受 4 位数字。"><InputOTPRoot><InputOTPGroup><InputOTPInput :index="0" :max-length="3" class="w-16" :transform="uppercase" :accept="letters" aria-label="字母前缀"/></InputOTPGroup><InputOTPSeparator>-</InputOTPSeparator><InputOTPGroup><InputOTPInput :index="1" :max-length="4" class="w-20" inputmode="numeric" :accept="digits" aria-label="数字后缀"/></InputOTPGroup></InputOTPRoot></Card></template>
