<script setup lang="ts">
import { TextareaClear, TextareaInput, TextareaRoot } from '@fex-design/vue/primitive/textarea'
import Card from '@fex-design/vue/ui/card'
import { ref } from 'vue'

const value = ref('Controlled textarea value')
</script>

<template>
  <Card
    title="Controlled and uncontrolled"
    description="Root owns the value protocol; callers can provide value or only defaultValue."
  >
    <div class="grid gap-space-lg md:grid-cols-2">
      <div class="space-y-space-sm">
        <TextareaRoot
          :value="value"
          :auto-size="{ minRows: 2, maxRows: 5 }"
          @change="(next) => (value = next)"
        >
          <TextareaInput aria-label="Controlled textarea" placeholder="Controlled" />
          <TextareaClear aria-label="Clear controlled textarea" />
        </TextareaRoot>
        <p class="text-sm text-muted-foreground">Value: {{ value || '(empty)' }}</p>
      </div>

      <TextareaRoot default-value="Uncontrolled textarea value" :auto-size="{ minRows: 2, maxRows: 5 }">
        <TextareaInput aria-label="Uncontrolled textarea" placeholder="Uncontrolled" />
        <TextareaClear aria-label="Clear uncontrolled textarea" />
      </TextareaRoot>
    </div>
  </Card>
</template>
