<script setup lang="ts">
import { Transfer } from '@fex-design/vue/primitive/transfer'
import Card from '@fex-design/vue/ui/card'
import { fieldNames, members } from './data'
import TablePanel from './table-panel.vue'
</script>
<template>
  <Card
    title="Custom DataTable body"
    description="Each side can use row selection without reimplementing target-key updates or move-all filtering."
    ><Transfer :items="members" :field-names="fieldNames" :default-target-keys="['ada', 'susan']"
      ><template #sourceBody="{ api }"><TablePanel :api="api" /></template
      ><template #targetBody="{ api }"><TablePanel :api="api" /></template></Transfer
  ></Card>
</template>
