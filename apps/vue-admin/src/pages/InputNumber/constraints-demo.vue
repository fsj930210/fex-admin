<script setup lang="ts">
import { InputNumber } from '@fex-design/vue/primitive/input-number'
import Card from '@fex-design/vue/ui/card'
</script>
<template>
  <Card
    title="Step and precision"
    description="Decimal stepping is rounded to the configured precision."
    ><InputNumber
      class="max-w-sm"
      :default-value="1.5"
      :step="0.25"
      :precision="2"
      aria-label="Decimal step"
  /></Card>
</template>
