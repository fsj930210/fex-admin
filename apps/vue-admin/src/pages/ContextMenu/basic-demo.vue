<script setup lang="ts">
import { ref } from 'vue'
import {
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuTrigger,
} from '@fex-design/vue/primitive/context-menu'
import MenuSurface from './menu-surface.vue'

const last = ref('Right click the panel')

function handleOpenChange(open: boolean, info: unknown) {
  if (!open) return
  const payload = info as { payload?: string; clientX?: number; clientY?: number }
  last.value =
    'Opened ' +
    payload.payload +
    ' at ' +
    Math.round(payload.clientX ?? 0) +
    ', ' +
    Math.round(payload.clientY ?? 0)
}
</script>

<template>
  <ContextMenuRoot @open-change="handleOpenChange">
    <ContextMenuTrigger payload="basic-panel" v-slot="{ props, ref }">
      <div
        :ref="ref"
        v-bind="props"
        tabindex="0"
        class="rounded-md border border-dashed border-border bg-background p-space-xl text-sm text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
      >
        {{ last }}
      </div>
    </ContextMenuTrigger>
    <ContextMenuPortal>
      <ContextMenuContent>
        <MenuSurface label="Panel actions" />
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>
