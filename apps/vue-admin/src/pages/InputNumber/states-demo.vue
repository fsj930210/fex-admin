<script setup lang="ts">
import { InputNumber } from '@fex-design/vue/primitive/input-number'
import Card from '@fex-design/vue/ui/card'
</script>
<template>
  <Card title="States" description="InputNumber reuses Input state styling."
    ><div class="grid gap-space-md md:grid-cols-2">
      <InputNumber disabled :default-value="10" aria-label="Disabled number" /><InputNumber
        read-only
        :default-value="10"
        aria-label="Read only number"
      /><InputNumber invalid :default-value="10" aria-label="Invalid number" /><InputNumber
        status="warning"
        :default-value="10"
        aria-label="Warning number"
      /></div
  ></Card>
</template>
