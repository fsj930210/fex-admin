<script setup lang="ts">
import { TextareaInput, TextareaRoot } from '@fex-design/vue/primitive/textarea'
import Card from '@fex-design/vue/ui/card'
import { ref } from 'vue'

const maxLength = 120
const value = ref('Textarea count is implemented by the demo, not by the primitive.')
</script>

<template>
  <Card title="Count" description="Character count is derived by the caller and rendered wherever needed.">
    <div class="max-w-xl space-y-space-sm">
      <TextareaRoot
        :value="value"
        :auto-size="{ minRows: 3, maxRows: 6 }"
        @change="(next) => (value = next)"
      >
        <TextareaInput aria-label="Textarea with count" :max-length="maxLength" />
      </TextareaRoot>
      <p class="text-right text-sm text-muted-foreground">{{ value.length }} / {{ maxLength }}</p>
    </div>
  </Card>
</template>
