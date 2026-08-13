<script setup lang="ts">
import { AspectRatio } from '@fex-design/vue/primitive/aspect-ratio'
import Card from '@fex-design/vue/ui/card'
defineProps<{ title: string; description: string; ratio: number; sizeClass: string }>()
</script>
<template>
  <Card :title :description
    ><AspectRatio :ratio class="rounded-md" :class="sizeClass"
      ><img
        src="/aspect-ratio-demo.svg"
        alt="Mountain landscape"
        class="size-full object-cover" /></AspectRatio
  ></Card>
</template>
