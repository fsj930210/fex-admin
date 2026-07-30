<script setup lang="ts">
import { ref } from 'vue'
import { Rate } from '@fex/components-vue/primitive/rate'
import Card from '@fex/components-vue/ui/card'
const value = ref(3)
</script>
<template><Card title="Default integer" description="The default step is 1, so pointer and keyboard input select whole values."><div class="grid gap-space-sm"><Rate :value="value" aria-label="Integer rating" @value-change="value = $event" /><p class="text-sm text-muted-foreground">Current value: {{ value }}</p></div></Card></template>
