<script setup lang="ts">
import type { InputOTPValue } from '@fex-design/core/input-otp/types'
import { InputOTPGroup, InputOTPInput, InputOTPRoot } from '@fex-design/vue/primitive/input-otp'
import Card from '@fex-design/vue/ui/card'
import { ref } from 'vue'
const value = ref<InputOTPValue>(['', '', ''])
</script>
<template><Card title="跨段粘贴" description="可从任意输入框开始粘贴，内容会按后续分段容量依次分配。"><div class="grid gap-space-md"><InputOTPRoot @change="(next) => value = next"><InputOTPGroup><InputOTPInput v-for="index in [0,1,2]" :key="index" :index="index" :max-length="3" class="w-16" :aria-label="`第 ${index + 1} 段`"/></InputOTPGroup></InputOTPRoot><p class="text-sm text-muted-foreground">分段值：{{ JSON.stringify(value) }}</p></div></Card></template>
