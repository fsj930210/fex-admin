<script setup lang="ts">
import { cn } from '@fex/utils'
import { computed, useAttrs } from 'vue'
import ChevronRightIcon from './chevron-right-icon.vue'

defineOptions({ name: 'ChevronLeftIcon', inheritAttrs: false })

const attrs = useAttrs()
const iconClass = computed(() => cn('rotate-180', attrs.class as string | undefined))
</script>

<template>
  <ChevronRightIcon v-bind="attrs" :class="iconClass" />
</template>
