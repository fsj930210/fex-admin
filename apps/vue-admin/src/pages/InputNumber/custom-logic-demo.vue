<script setup lang="ts">
import { ref } from 'vue'
import { stepInputNumber } from '@fex-design/core/input-number/value'
import { MinusIcon } from '@fex-design/vue/icon/minus'
import { PlusIcon } from '@fex-design/vue/icon/plus'
import Button from '@fex-design/vue/ui/button'
import Card from '@fex-design/vue/ui/card'
const value = ref(5)
const step = (direction: 'increment' | 'decrement') =>
  (value.value = stepInputNumber(value.value, direction, { min: 0, max: 10 }))
</script>
<template>
  <Card title="Custom primitive logic" description="Shared core rules can drive custom DOM."
    ><div class="inline-flex items-center gap-space-md">
      <Button aria-label="Decrease value" :disabled="value <= 0" @click="step('decrement')"
        ><MinusIcon /></Button
      ><output>{{ value }}</output
      ><Button aria-label="Increase value" :disabled="value >= 10" @click="step('increment')"
        ><PlusIcon
      /></Button></div
  ></Card>
</template>
