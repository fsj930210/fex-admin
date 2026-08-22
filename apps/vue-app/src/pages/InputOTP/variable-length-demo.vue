<script setup lang="ts">
import { InputOTPGroup, InputOTPInput, InputOTPRoot, InputOTPSeparator } from '@fex-design/vue/primitive/input-otp'
import Card from '@fex-design/vue/ui/card'
</script>
<template><Card title="多字符分段" description="每段可设置不同最大长度，填满前保持当前焦点。"><InputOTPRoot><InputOTPGroup><InputOTPInput :index="0" :max-length="3" class="w-16" aria-label="银行代码"/><InputOTPInput :index="1" :max-length="3" class="w-16" aria-label="分行代码"/></InputOTPGroup><InputOTPSeparator>/</InputOTPSeparator><InputOTPGroup><InputOTPInput :index="2" :max-length="4" class="w-20" aria-label="账户前缀"/><InputOTPInput :index="3" :max-length="4" class="w-20" aria-label="账户后缀"/></InputOTPGroup></InputOTPRoot></Card></template>
