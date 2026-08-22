<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuTrigger,
} from '@fex-design/vue/primitive/context-menu'
import MenuSurface from './menu-surface.vue'

const columns = ['Name', 'Department', 'Status', 'Progress']
const rows: Array<[string, string, string, string]> = [
  ['Ada Lovelace', 'Platform', 'Active', '82%'],
  ['Grace Hopper', 'Components', 'Active', '91%'],
  ['Katherine Johnson', 'Docs', 'Paused', '64%'],
]
const activePayload = ref('')
const label = computed(() => activePayload.value.startsWith('column:') ? 'Column actions' : 'Row actions')

function handleOpenChange(open: boolean, info: unknown) {
  if (!open) return
  activePayload.value = (info as { payload?: string }).payload ?? ''
}
</script>

<template>
  <ContextMenuRoot @open-change="handleOpenChange">
    <div class="overflow-hidden rounded-md border border-border bg-background">
      <table class="w-full border-collapse text-sm">
        <thead class="bg-muted-background text-muted-foreground">
          <tr>
            <ContextMenuTrigger
              v-for="column in columns"
              :key="column"
              :payload="'column:' + column"
              v-slot="{ props, ref }"
            >
              <th
                :ref="ref"
                v-bind="props"
                scope="col"
                tabindex="0"
                class="border-b border-border px-3 py-2 text-left font-medium outline-none hover:bg-background focus:bg-background"
              >
                {{ column }}
              </th>
            </ContextMenuTrigger>
          </tr>
        </thead>
        <tbody>
          <ContextMenuTrigger
            v-for="row in rows"
            :key="row[0]"
            :payload="'row:' + row[0]"
            v-slot="{ props, ref }"
          >
            <tr
              :ref="ref"
              v-bind="props"
              tabindex="0"
              class="outline-none hover:bg-muted-background focus:bg-muted-background"
            >
              <td
                v-for="cell in row"
                :key="cell"
                class="border-b border-border px-3 py-2 last:text-right"
              >
                {{ cell }}
              </td>
            </tr>
          </ContextMenuTrigger>
        </tbody>
      </table>
    </div>
    <ContextMenuPortal>
      <ContextMenuContent>
        <MenuSurface :label="label" />
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>
