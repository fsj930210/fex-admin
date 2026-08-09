<script setup lang="ts">
import { InputNumber } from '@fex-design/vue/primitive/input-number'
import Card from '@fex-design/vue/ui/card'
</script>

<template>
  <Card title="Min and max" description="Actions are disabled when the value reaches its boundary.">
    <div class="grid gap-space-lg md:grid-cols-2">
      <label class="grid gap-space-sm text-sm text-foreground">
        Minimum: 0
        <InputNumber :default-value="0" :min="0" :max="10" aria-label="Value at minimum" />
      </label>
      <label class="grid gap-space-sm text-sm text-foreground">
        Maximum: 10
        <InputNumber :default-value="10" :min="0" :max="10" aria-label="Value at maximum" />
      </label>
    </div>
  </Card>
</template>
