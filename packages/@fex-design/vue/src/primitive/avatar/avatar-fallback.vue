<script setup lang="ts">
import { avatarFallbackClassName } from '@fex-design/styles/avatar'
import { cn } from '@fex/utils'
import { inject, useAttrs } from 'vue'
import { avatarContext } from './context'
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const context = inject(avatarContext)
</script>
<template>
  <span
    v-if="!context?.loaded.value"
    v-bind="attrs"
    data-slot="avatar-fallback"
    :class="cn(avatarFallbackClassName, attrs.class as string | undefined)"
    ><slot
  /></span>
</template>
