<script setup lang="ts">
import Card from '@fex/components-vue/ui/card'
defineProps<{ title: string; description: string }>()
</script>
<template>
  <Card :title="title" :description="description"
    ><div class="max-w-md"><slot /></div
  ></Card>
</template>
