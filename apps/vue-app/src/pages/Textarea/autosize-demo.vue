<script setup lang="ts">
import { TextareaInput, TextareaRoot } from '@fex-design/vue/primitive/textarea'
import Card from '@fex-design/vue/ui/card'

const defaultValue =
  'Line one starts at the minimum height.\nLine two expands the textarea.\nLine three keeps growing.\nLine four reaches the configured maxRows.\nLine five now scrolls inside.'
</script>

<template>
  <Card
    title="Autosize"
    description="autoSize={{ minRows: 1, maxRows: 4 }}: content grows the field up to 4 rows, then the textarea scrolls."
  >
    <TextareaRoot
      class="max-w-xl"
      :auto-size="{ minRows: 1, maxRows: 4 }"
      :default-value="defaultValue"
    >
      <TextareaInput
        aria-label="Autosize textarea"
        placeholder="Type multiple lines to grow the input"
      />
    </TextareaRoot>
  </Card>
</template>
