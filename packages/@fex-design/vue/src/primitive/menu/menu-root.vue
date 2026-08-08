<script setup lang="ts">
import { computed, useAttrs } from 'vue'
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const role = computed(() => (attrs.role as string | undefined) ?? 'menu')
</script>

<template>
  <div v-bind="attrs" :role="role" data-slot="menu"><slot /></div>
</template>
