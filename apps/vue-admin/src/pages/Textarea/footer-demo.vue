<script setup lang="ts">
import {
  TextareaClear,
  TextareaFooter,
  TextareaInput,
  TextareaRoot,
} from '@fex-design/vue/primitive/textarea'
import Button from '@fex-design/vue/ui/button'
import Card from '@fex-design/vue/ui/card'
import { CheckIcon } from '@fex-design/vue/icon/check'
import { InfoIcon } from '@fex-design/vue/icon/info'
import { PlusIcon } from '@fex-design/vue/icon/plus'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <Card title="Footer" description="Footer is only a layout slot; actions are fully owned by the caller.">
    <TextareaRoot
      class="max-w-2xl"
      :value="value"
      :auto-size="{ minRows: 1, maxRows: 8 }"
      @change="(next) => (value = next)"
    >
      <TextareaInput aria-label="AI message" placeholder="Ask anything" />
      <TextareaClear aria-label="Clear message" />
      <TextareaFooter>
        <div class="flex min-w-0 flex-wrap items-center gap-1">
          <Button aria-label="Attach" size="icon-sm" variant="ghost"><template #icon><PlusIcon /></template></Button>
          <Button size="sm" variant="ghost"><template #icon><InfoIcon /></template>Context</Button>
        </div>
        <div class="flex shrink-0 items-center gap-2">
          <span>{{ value.length }} / 2000</span>
          <Button aria-label="Send" :disabled="!value.trim()" size="icon-sm"><template #icon><CheckIcon /></template></Button>
        </div>
      </TextareaFooter>
    </TextareaRoot>
  </Card>
</template>
