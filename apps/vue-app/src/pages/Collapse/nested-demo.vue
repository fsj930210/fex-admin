<script setup lang="ts">
import { Collapse, CollapseContent, CollapseItem, CollapseTrigger } from '@fex-design/vue/primitive/collapse'
import Card from '@fex-design/vue/ui/card'
import { collapseText } from './demo-data'
</script>

<template>
  <Card title="Nested" description="Nested instances keep separate expansion state.">
    <Collapse :default-expanded-keys="['outer']">
      <CollapseItem value="outer">
        <CollapseTrigger>Outer panel</CollapseTrigger>
        <CollapseContent>
          <Collapse :default-expanded-keys="['inner']">
            <CollapseItem value="inner">
              <CollapseTrigger>Nested panel</CollapseTrigger>
              <CollapseContent>{{ collapseText }}</CollapseContent>
            </CollapseItem>
          </Collapse>
        </CollapseContent>
      </CollapseItem>
    </Collapse>
  </Card>
</template>
