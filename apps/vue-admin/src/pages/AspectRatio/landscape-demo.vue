<script setup lang="ts">
import RatioDemo from './ratio-demo.vue'
</script>
<template>
  <RatioDemo
    title="Landscape"
    description="A 16:9 media container."
    :ratio="16 / 9"
    size-class="max-w-2xl"
  />
</template>
