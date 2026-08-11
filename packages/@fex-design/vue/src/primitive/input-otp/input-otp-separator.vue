<script setup lang="ts">
import { inputOTPSeparatorClassName } from '@fex-design/styles/input-otp'
import { cn } from '@fex/utils'
import { useAttrs } from 'vue'
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
</script>
<template>
  <span
    v-bind="attrs"
    aria-hidden="true"
    data-slot="input-otp-separator"
    :class="cn(inputOTPSeparatorClassName, attrs.class as string | undefined)"
  ><slot>–</slot></span>
</template>
