<script setup lang="ts">
import { Transfer } from '@fex-design/vue/primitive/transfer'
import Card from '@fex-design/vue/ui/card'
import { ref } from 'vue'
import { fieldNames, members } from './data'
const targetKeys = ref<readonly (string | number)[]>(['susan'])
</script>
<template>
  <Card
    title="Basic, controlled and uncontrolled"
    description="The first Transfer owns its target keys; the second exposes target keys and complete moved items through onChange meta."
    ><div class="grid gap-space-lg xl:grid-cols-2">
      <section class="space-y-space-sm">
        <h3 class="text-sm font-medium">Uncontrolled</h3>
        <Transfer
          :items="members"
          :field-names="fieldNames"
          :default-target-keys="['grace']"
          :title="{ source: 'Available', target: 'Assigned' }"
        />
      </section>
      <section class="space-y-space-sm">
        <h3 class="text-sm font-medium">Controlled</h3>
        <Transfer
          :items="members"
          :field-names="fieldNames"
          :target-keys="targetKeys"
          :title="{ source: 'Team directory', target: 'Project team' }"
          @change="targetKeys = $event"
        />
        <p class="text-xs text-muted-foreground">
          Target keys: {{ targetKeys.join(', ') || 'none' }}
        </p>
      </section>
    </div></Card
  >
</template>
