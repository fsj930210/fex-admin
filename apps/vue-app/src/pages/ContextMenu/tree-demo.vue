<script setup lang="ts">
import {
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuTrigger,
} from '@fex-design/vue/primitive/context-menu'
import MenuSurface from './menu-surface.vue'

const nodes = [
  { id: 'company', name: 'Fex Design', level: 0 },
  { id: 'platform', name: 'Platform team', level: 1 },
  { id: 'components', name: 'Components team', level: 1 },
  { id: 'docs', name: 'Docs team', level: 1 },
]
</script>

<template>
  <ContextMenuRoot>
    <div role="tree" class="max-w-md rounded-md border border-border bg-background p-1">
      <ContextMenuTrigger
        v-for="node in nodes"
        :key="node.id"
        :payload="node.id"
        v-slot="{ props, ref }"
      >
        <div
          :ref="ref"
          v-bind="props"
          role="treeitem"
          tabindex="0"
          :aria-level="node.level + 1"
          class="flex h-8 items-center rounded-md px-2 text-sm outline-none hover:bg-muted-background focus:bg-muted-background"
          :style="{ paddingLeft: 8 + node.level * 20 + 'px' }"
        >
          {{ node.name }}
        </div>
      </ContextMenuTrigger>
    </div>
    <ContextMenuPortal>
      <ContextMenuContent>
        <MenuSurface label="Tree node actions" />
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>
