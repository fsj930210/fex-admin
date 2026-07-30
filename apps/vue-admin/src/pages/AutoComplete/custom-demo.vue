<script setup lang="ts">
import { AutoCompleteContent, AutoCompleteList, AutoCompleteRoot, AutoCompleteTrigger } from '@fex/components-vue/primitive/auto-complete'
import Card from '@fex/components-vue/ui/card'
import { fieldNames, users } from './data'
</script>
<template>
  <div class="grid gap-space-xl md:grid-cols-2">
    <Card title="Custom items and disabled suggestion" description="Original backend items drive richer rows; Alex is disabled.">
      <AutoCompleteRoot :items="users" :field-names="fieldNames">
        <AutoCompleteTrigger placeholder="Custom suggestion rows" clearable status="warning" />
        <AutoCompleteContent>
          <div class="border-b border-border px-3 py-2 text-xs text-muted-foreground">People directory</div>
          <AutoCompleteList>
            <template #option="{ item, disabled }">
              <div><div class="font-medium">{{ item.name }}</div><div class="text-xs text-muted-foreground">{{ item.department }} · {{ item.email }}{{ disabled ? ' · unavailable' : '' }}</div></div>
            </template>
          </AutoCompleteList>
        </AutoCompleteContent>
      </AutoCompleteRoot>
    </Card>
    <Card title="Validation and native props" description="Input validation styles and native form attributes are preserved.">
      <AutoCompleteRoot :items="users" :field-names="fieldNames">
        <AutoCompleteTrigger name="reviewer" required aria-describedby="reviewer-error-vue" placeholder="Required reviewer" clearable invalid status="error" />
        <AutoCompleteContent />
      </AutoCompleteRoot>
      <p id="reviewer-error-vue" class="mt-space-sm text-xs text-danger">Choose a reviewer or enter a new name.</p>
    </Card>
  </div>
</template>
