<script setup lang="ts">
import { Transfer } from '@fex/components-vue/primitive/transfer'
import Card from '@fex/components-vue/ui/card'
import { fieldNames, members } from './data'
import TreePanel from './tree-panel.vue'
</script>
<template>
  <Card
    title="Custom Tree body"
    description="The Tree only binds checkedKeys and setCheckedKeys; all four move operations remain owned by Transfer."
    ><Transfer :items="members" :field-names="fieldNames" :default-target-keys="['susan']"
      ><template #sourceBody="{ api }"><TreePanel :api="api" /></template
      ><template #targetBody="{ api }"><TreePanel :api="api" /></template></Transfer
  ></Card>
</template>
