<script setup lang="ts">
import { avatarImageClassName } from '@fex-design/styles/avatar'
import { cn } from '@fex/utils'
import { inject, useAttrs } from 'vue'
import { avatarContext } from './context'
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const context = inject(avatarContext)
function load() {
  if (context) context.loaded.value = true
}
function error() {
  if (context) context.loaded.value = false
}
</script>
<template>
  <img
    v-bind="attrs"
    v-show="context?.loaded.value"
    data-slot="avatar-image"
    :class="cn(avatarImageClassName, attrs.class as string | undefined)"
    @load="load"
    @error="error"
  />
</template>
