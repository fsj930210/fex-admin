<script setup lang="ts">
import { Collapse, CollapseContent, CollapseItem, CollapseTrigger } from '@fex-design/vue/primitive/collapse'
import Card from '@fex-design/vue/ui/card'
import { collapseItems } from './demo-data'
</script>

<template>
  <Card title="Basic" description="Multiple panels can be open at the same time by default.">
    <Collapse :default-expanded-keys="['profile']">
      <CollapseItem v-for="item in collapseItems" :key="item.value" :value="item.value">
        <CollapseTrigger>{{ item.title }}</CollapseTrigger>
        <CollapseContent>{{ item.content }}</CollapseContent>
      </CollapseItem>
    </Collapse>
  </Card>
</template>
