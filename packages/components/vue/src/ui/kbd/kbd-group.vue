<script setup lang="ts">
import { kbdGroupClassName } from '@fex/components-styles/kbd'
import { cn } from '@fex/utils'
import { useAttrs } from 'vue'

defineOptions({ name: 'KbdGroup', inheritAttrs: false })

const attrs = useAttrs()
</script>

<template>
  <div v-bind="attrs" data-slot="kbd-group" :class="cn(kbdGroupClassName, attrs.class as string | undefined)">
    <slot />
  </div>
</template>
