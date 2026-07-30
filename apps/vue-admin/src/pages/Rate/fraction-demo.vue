<script setup lang="ts">
import { ref } from 'vue'
import { Rate } from '@fex/components-vue/primitive/rate'
import Card from '@fex/components-vue/ui/card'
const value = ref(4.3)
const previewValue = ref<number | null>(null)
</script>
<template><Card title="Arbitrary fractions" description="step controls interaction precision, while read-only values preserve their exact fraction."><div class="grid gap-space-lg"><div class="grid gap-space-sm"><Rate :value="value" :step="0.1" aria-label="Decimal rating" :get-value-text="(next, count) => `${next} points out of ${count}`" @value-preview-change="previewValue = $event" @value-change="value = $event" /><p class="text-sm text-muted-foreground">Interactive value: {{ (previewValue ?? value).toFixed(1) }}</p></div><div class="grid gap-space-sm"><Rate :value="4.37" read-only aria-label="Exact read-only rating" /><p class="text-sm text-muted-foreground">Read-only value: 4.37</p></div></div></Card></template>
