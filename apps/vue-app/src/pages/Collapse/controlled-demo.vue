<script setup lang="ts">
import type { ExpansionKey } from '@fex-design/core/expansion/types'
import { Collapse, CollapseContent, CollapseItem, CollapseTrigger } from '@fex-design/vue/primitive/collapse'
import Button from '@fex-design/vue/ui/button'
import Card from '@fex-design/vue/ui/card'
import { ref } from 'vue'
import { collapseItems } from './demo-data'

const expandedKeys = ref<ExpansionKey[]>(['billing'])
</script>

<template>
  <Card title="Controlled" description="expandedKeys and change let external state own the panels.">
    <div class="mb-space-md flex flex-wrap gap-space-sm">
      <Button variant="outline" size="sm" @click="expandedKeys = ['profile']">Open profile</Button>
      <Button variant="outline" size="sm" @click="expandedKeys = ['billing', 'security']">
        Open billing and security
      </Button>
      <Button variant="ghost" size="sm" @click="expandedKeys = []">Clear</Button>
    </div>
    <Collapse :expanded-keys="expandedKeys" @change="(keys) => (expandedKeys = keys)">
      <CollapseItem v-for="item in collapseItems" :key="item.value" :value="item.value">
        <CollapseTrigger>{{ item.title }}</CollapseTrigger>
        <CollapseContent>{{ item.content }}</CollapseContent>
      </CollapseItem>
    </Collapse>
  </Card>
</template>
