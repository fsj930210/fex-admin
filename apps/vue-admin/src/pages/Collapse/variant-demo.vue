<script setup lang="ts">
import { Collapse, CollapseContent, CollapseItem, CollapseTrigger, type CollapseVariant } from '@fex-design/vue/primitive/collapse'
import Card from '@fex-design/vue/ui/card'
import { collapseText } from './demo-data'

const variants: CollapseVariant[] = ['outlined', 'filled', 'ghost']
</script>

<template>
  <Card title="Variants" description="Outlined, filled and ghost cover bordered and borderless panel styles.">
    <div class="grid gap-space-lg lg:grid-cols-3">
      <Collapse v-for="variant in variants" :key="variant" :variant="variant" :default-expanded-keys="['one']">
        <CollapseItem value="one">
          <CollapseTrigger>{{ variant }}</CollapseTrigger>
          <CollapseContent>{{ collapseText }}</CollapseContent>
        </CollapseItem>
        <CollapseItem value="two">
          <CollapseTrigger>Second panel</CollapseTrigger>
          <CollapseContent>{{ collapseText }}</CollapseContent>
        </CollapseItem>
      </Collapse>
    </div>
  </Card>
</template>
