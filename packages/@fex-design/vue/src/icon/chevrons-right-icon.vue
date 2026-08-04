<script setup lang="ts">
import { useAttrs } from 'vue'
</script>
<template>
  <svg
    v-bind="useAttrs()"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="m7 18 6-6-6-6" />
    <path d="m13 18 6-6-6-6" />
  </svg>
</template>
