<script setup lang="ts">
import { ref } from 'vue'
import { InputNumber } from '@fex-design/vue/primitive/input-number'
import Card from '@fex-design/vue/ui/card'
const message = ref('Use ArrowUp, ArrowDown or the icon buttons.')
</script>
<template>
  <Card
    title="Keyboard and events"
    description="The native event stays first and the numeric value is appended."
    ><div class="max-w-sm space-y-space-sm">
      <InputNumber
        clearable
        :default-value="5"
        aria-label="Keyboard number"
        @change="(event, value) => (message = `${event.type}: ${value ?? 'empty'}`)"
      />
      <p class="text-sm text-muted-foreground">{{ message }}</p>
    </div></Card
  >
</template>
