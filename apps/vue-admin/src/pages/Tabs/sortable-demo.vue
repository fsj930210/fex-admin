<script setup lang="ts">
import type { SortableItems } from '@fex/components-core/sortable/types'
import { EllipsisIcon } from '@fex/components-vue/icon/more'
import { SortableItem, SortableOverlay, SortableRoot } from '@fex/components-vue/primitive/sortable'
import { TabsContent, TabsItem, TabsList, TabsRoot } from '@fex/components-vue/primitive/tabs'
import Card from '@fex/components-vue/ui/card'
import { ref } from 'vue'
import { initialTabs } from './data'

const fixed = initialTabs[0]!
const items = ref(initialTabs.slice(1))
const asValues = (values: SortableItems) => values as string[]
const itemByValue = (value: string) => items.value.find((item) => item.value === value)

function update(values: SortableItems) {
  const byValue = new Map(items.value.map((item) => [item.value, item]))
  items.value = asValues(values).map((value) => byValue.get(value)).filter((item): item is NonNullable<typeof item> => Boolean(item))
}
</script>

<template>
  <Card title="Sortable composition" description="Overview stays fixed while the remaining tabs can be dragged horizontally.">
    <SortableRoot :items="items.map((item) => item.value)" axis="x" class="!block" @change="update" v-slot="{ items: preview }">
      <TabsRoot default-value="overview">
        <TabsList>
          <TabsItem :value="fixed.value">{{ fixed.label }}</TabsItem>
          <SortableItem v-for="value in asValues(preview)" :key="value" :id="value" class="!inline-flex !min-h-0 !border-0 !bg-transparent !p-0 !shadow-none">
            <TabsItem :value="value" class="cursor-grab touch-none active:cursor-grabbing">
              <EllipsisIcon class="size-3 rotate-90 text-muted-foreground" />
              {{ itemByValue(value)?.label }}
            </TabsItem>
          </SortableItem>
        </TabsList>
        <TabsContent :value="fixed.value">{{ fixed.content }}</TabsContent>
        <TabsContent v-for="item in items" :key="item.value" :value="item.value">{{ item.content }}</TabsContent>
      </TabsRoot>
      <SortableOverlay class="!box-border !inline-flex !h-7 !min-h-0 !items-center !rounded-md !border-0 !bg-muted-background !p-0 !text-muted-foreground !shadow-sm !outline-none !ring-0" v-slot="{ activeId }">
        <div class="flex h-7 items-center gap-1.5 px-2.5 text-sm"><EllipsisIcon class="size-3 rotate-90" />{{ itemByValue(String(activeId))?.label }}</div>
      </SortableOverlay>
    </SortableRoot>
  </Card>
</template>
