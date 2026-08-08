<script setup lang="ts">
import { qrcodeOverlayClassName } from '@fex-design/styles/qrcode'
import { cn } from '@fex/utils'
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{ class?: string }>()
const attrs = useAttrs()
const className = computed(() => cn(qrcodeOverlayClassName, attrs.class as string | undefined, props.class))
</script>

<template>
  <div v-bind="attrs" data-slot="qrcode-overlay" :class="className">
    <slot />
  </div>
</template>
