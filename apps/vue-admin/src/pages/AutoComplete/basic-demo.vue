<script setup lang="ts">
import { AutoCompleteContent, AutoCompleteRoot, AutoCompleteTrigger } from '@fex/components-vue/primitive/auto-complete'
import Card from '@fex/components-vue/ui/card'
import { ref } from 'vue'
import { fieldNames, users } from './data'
const selected = ref('No suggestion accepted')
</script>
<template>
  <Card title="Free input and local suggestions" description="Type any text, or accept a matching name with pointer or keyboard.">
    <AutoCompleteRoot :items="users" :field-names="fieldNames" @select="(_, meta) => selected = `${meta.selectedItem.name} · ${meta.selectedItem.email}`">
      <AutoCompleteTrigger placeholder="Try A or Bella" clearable />
      <AutoCompleteContent />
    </AutoCompleteRoot>
    <p class="mt-space-sm text-xs text-muted-foreground">{{ selected }}</p>
  </Card>
</template>
