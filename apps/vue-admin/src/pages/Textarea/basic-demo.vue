<script setup lang="ts">
import { TextareaInput, TextareaRoot } from '@fex-design/vue/primitive/textarea'
import Card from '@fex-design/vue/ui/card'
</script>

<template>
  <Card title="Basic" description="TextareaInput keeps native textarea semantics inside TextareaRoot.">
    <TextareaRoot class="max-w-xl" default-value="Review the latest support request.">
      <TextareaInput aria-label="Basic textarea" placeholder="Write a note" />
    </TextareaRoot>
  </Card>
</template>
