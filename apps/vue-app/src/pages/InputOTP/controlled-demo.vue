<script setup lang="ts">
import type { InputOTPValue } from '@fex-design/core/input-otp/types'
import { InputOTPGroup, InputOTPInput, InputOTPRoot } from '@fex-design/vue/primitive/input-otp'
import Button from '@fex-design/vue/ui/button'
import Card from '@fex-design/vue/ui/card'
import { ref } from 'vue'
const value=ref<InputOTPValue>(['AB','',''])
</script>
<template><Card title="受控值" description="外部状态可以更新或清空所有输入段。"><div class="grid gap-space-md"><InputOTPRoot :value="value" @change="(next)=>value=next"><InputOTPGroup><InputOTPInput v-for="index in [0,1,2]" :key="index" :index="index" :max-length="2" class="w-14" :aria-label="`受控输入第 ${index+1} 段`"/></InputOTPGroup></InputOTPRoot><p class="text-sm text-muted-foreground">分段值：{{ JSON.stringify(value) }}</p><Button class="w-fit" variant="outline" @click="value=['','','']">清空</Button></div></Card></template>
