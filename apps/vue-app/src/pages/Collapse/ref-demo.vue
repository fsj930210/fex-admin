<script setup lang="ts">
import { Collapse, CollapseContent, CollapseItem, CollapseTrigger } from '@fex-design/vue/primitive/collapse'
import Button from '@fex-design/vue/ui/button'
import Card from '@fex-design/vue/ui/card'
import { useTemplateRef } from 'vue'
import { collapseItems } from './demo-data'

const collapseRef = useTemplateRef<InstanceType<typeof Collapse>>('collapseRef')
</script>

<template>
  <Card title="Instance methods" description="Template refs expose methods for this Collapse instance.">
    <div class="mb-space-md flex flex-wrap gap-space-sm">
      <Button variant="outline" size="sm" @click="collapseRef?.expand('security')">Open security</Button>
      <Button variant="outline" size="sm" @click="collapseRef?.toggle('billing')">Toggle billing</Button>
      <Button variant="ghost" size="sm" @click="collapseRef?.clear()">Clear</Button>
    </div>
    <Collapse ref="collapseRef" :default-expanded-keys="['profile']">
      <CollapseItem v-for="item in collapseItems" :key="item.value" :value="item.value">
        <CollapseTrigger>{{ item.title }}</CollapseTrigger>
        <CollapseContent>{{ item.content }}</CollapseContent>
      </CollapseItem>
    </Collapse>
  </Card>
</template>
