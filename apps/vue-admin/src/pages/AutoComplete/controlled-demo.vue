<script setup lang="ts">
import {
  AutoCompleteContent,
  AutoCompleteRoot,
  AutoCompleteTrigger,
} from '@fex-design/vue/primitive/auto-complete'
import Card from '@fex-design/vue/ui/card'
import { ref } from 'vue'
import { fieldNames, users } from './data'
const value = ref('A')
const open = ref(false)
</script>
<template>
  <Card
    title="Controlled value and panel"
    description="Both public states are controlled; active suggestion stays internal."
  >
    <AutoCompleteRoot
      :items="users"
      :field-names="fieldNames"
      :value="value"
      :open="open"
      @change="(next) => (value = next)"
      @open-change="(next) => (open = next)"
    >
      <AutoCompleteTrigger placeholder="Controlled input" clearable />
      <AutoCompleteContent />
    </AutoCompleteRoot>
    <p class="mt-space-sm text-xs text-muted-foreground">
      value: {{ value || '(empty)' }} · open: {{ open }}
    </p>
  </Card>
</template>
