<script setup lang="ts">
import { kbdClassName } from '@fex/components-styles/kbd'
import { cn } from '@fex/utils'
import { useAttrs } from 'vue'

defineOptions({ name: 'FexKbd', inheritAttrs: false })

const attrs = useAttrs()
</script>

<template>
  <kbd v-bind="attrs" data-slot="kbd" :class="cn(kbdClassName, attrs.class as string | undefined)">
    <slot />
  </kbd>
</template>
