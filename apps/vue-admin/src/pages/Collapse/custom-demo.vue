<script setup lang="ts">
import { Collapse, CollapseContent, CollapseItem } from '@fex-design/vue/primitive/collapse'
import Button from '@fex-design/vue/ui/button'
import Card from '@fex-design/vue/ui/card'
import { ChevronRightIcon } from '@fex-design/vue/icon/chevron'
import { collapseItems } from './demo-data'
</script>

<template>
  <Card title="Custom trigger" description="Use item slot actions when the toggle target is fully custom.">
    <Collapse variant="ghost" :default-expanded-keys="['profile']">
      <CollapseItem v-for="item in collapseItems" :key="item.value" :value="item.value" v-slot="{ state, actions }">
        <div class="flex items-center gap-space-sm px-space-sm py-space-sm">
          <Button variant="ghost" size="icon-sm" :aria-expanded="state.expanded" aria-label="Toggle panel" @click="actions.toggle">
            <ChevronRightIcon :class="['size-4 transition-transform', state.expanded && '-rotate-90']" />
          </Button>
          <span class="flex-1 text-sm font-medium">{{ item.title }}</span>
          <Button variant="outline" size="sm" @click="actions.expand">Open</Button>
        </div>
        <CollapseContent class="pt-0">{{ item.content }}</CollapseContent>
      </CollapseItem>
    </Collapse>
  </Card>
</template>
