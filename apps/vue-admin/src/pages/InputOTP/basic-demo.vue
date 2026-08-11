<script setup lang="ts">
import { InputOTPGroup, InputOTPInput, InputOTPRoot, InputOTPSeparator } from '@fex-design/vue/primitive/input-otp'
import Card from '@fex-design/vue/ui/card'
</script>
<template><Card title="单字符验证码" description="每个输入框填满后才自动聚焦下一段。"><InputOTPRoot aria-label="六位验证码"><InputOTPGroup><InputOTPInput v-for="index in [0,1,2]" :key="index" :index="index" :max-length="1" inputmode="numeric" :aria-label="`第 ${index + 1} 位`" /></InputOTPGroup><InputOTPSeparator /><InputOTPGroup><InputOTPInput v-for="index in [3,4,5]" :key="index" :index="index" :max-length="1" inputmode="numeric" :aria-label="`第 ${index + 1} 位`" /></InputOTPGroup></InputOTPRoot></Card></template>
