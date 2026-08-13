<script setup lang="ts">
import RatioDemo from './ratio-demo.vue'
</script>
<template>
  <RatioDemo
    title="Portrait"
    description="A 9:16 media container."
    :ratio="9 / 16"
    size-class="max-w-48"
  />
</template>
