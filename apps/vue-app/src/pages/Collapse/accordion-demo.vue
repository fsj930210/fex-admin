<script setup lang="ts">
import { Collapse, CollapseContent, CollapseItem, CollapseTrigger } from '@fex-design/vue/primitive/collapse'
import Card from '@fex-design/vue/ui/card'
import { collapseItems } from './demo-data'
</script>

<template>
  <Card title="Accordion" description="Set multiple=false to keep at most one panel expanded.">
    <Collapse :multiple="false" :collapsible="false" :default-expanded-keys="['profile']">
      <CollapseItem v-for="item in collapseItems" :key="item.value" :value="item.value">
        <CollapseTrigger>{{ item.title }}</CollapseTrigger>
        <CollapseContent>{{ item.content }}</CollapseContent>
      </CollapseItem>
    </Collapse>
  </Card>
</template>
