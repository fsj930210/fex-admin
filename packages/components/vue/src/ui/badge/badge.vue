<script setup lang="ts">
import { badgeClassName, type BadgeStyleProps } from '@fex/components-styles/badge'
import { cn } from '@fex/utils'
import { computed, useAttrs } from 'vue'

defineOptions({ name: 'Badge', inheritAttrs: false })

const props = defineProps<{
  variant?: BadgeStyleProps['variant']
}>()

const attrs = useAttrs()
const variant = computed(() => props.variant ?? 'default')
</script>

<template>
  <span
    v-bind="attrs"
    data-slot="badge"
    :data-variant="variant"
    :class="cn(badgeClassName({ variant }), attrs.class as string | undefined)"
  >
    <slot />
  </span>
</template>
