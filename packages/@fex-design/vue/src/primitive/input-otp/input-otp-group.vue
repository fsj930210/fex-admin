<script setup lang="ts">
import { inputOTPGroupClassName } from '@fex-design/styles/input-otp'
import { cn } from '@fex/utils'
import { useAttrs } from 'vue'
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
</script>
<template>
  <div
    v-bind="attrs"
    data-slot="input-otp-group"
    :class="cn(inputOTPGroupClassName, attrs.class as string | undefined)"
  ><slot /></div>
</template>
