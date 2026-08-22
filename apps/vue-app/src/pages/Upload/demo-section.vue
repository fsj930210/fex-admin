<script setup lang="ts">
import Card from '@fex-design/vue/ui/card'
defineProps<{ title: string; description: string }>()
</script>
<template>
  <Card :title="title" :description="description"><slot /></Card>
</template>
