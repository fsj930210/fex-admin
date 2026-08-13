<script setup lang="ts">
import { skeletonClassName } from '@fex-design/styles/skeleton'
import { cn } from '@fex/utils'
import { useAttrs } from 'vue'
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
</script>
<template>
  <div
    v-bind="attrs"
    aria-hidden="true"
    data-slot="skeleton"
    :class="cn(skeletonClassName, attrs.class as string | undefined)"
  />
</template>
