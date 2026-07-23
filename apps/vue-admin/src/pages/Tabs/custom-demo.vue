<script setup lang="ts">
import { TabsContent, TabsItem, TabsList, TabsRoot } from '@fex/components-vue/primitive/tabs'
import Card from '@fex/components-vue/ui/card'
import { cn } from '@fex/utils'

const itemClassName = 'justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
const contentClassName = 'mt-space-md border-l-2 border-primary pl-space-md'
const mergeClass = (value: unknown, extra: string) => cn(typeof value === 'string' ? value : undefined, extra)
const omitClass = ({ class: _class, ...props }: Record<string, unknown>) => props
</script>

<template>
  <Card title="Custom render" description="Children functions replace List, Item and Content root nodes without losing behavior.">
    <TabsRoot default-value="files">
      <TabsList>
        <template #render="{ props }">
          <ul v-bind="props" :class="mergeClass(props.class, 'rounded-md border border-border bg-secondary-background p-2')">
            <TabsItem value="files">
              <template #render="{ props: itemProps, state }">
                <li v-bind="itemProps" :class="mergeClass(itemProps.class, itemClassName)">
                  Files
                  <span v-if="state.active" aria-hidden="true" class="size-1.5 rounded-full bg-current" />
                </li>
              </template>
            </TabsItem>
            <TabsItem value="search">
              <template #render="{ props: itemProps, state }">
                <li v-bind="itemProps" :class="mergeClass(itemProps.class, itemClassName)">
                  Search
                  <span v-if="state.active" aria-hidden="true" class="size-1.5 rounded-full bg-current" />
                </li>
              </template>
            </TabsItem>
          </ul>
        </template>
      </TabsList>
      <TabsContent value="files">
        <template #render="{ props }"><section v-bind="omitClass(props)" :class="contentClassName">Fully custom files panel.</section></template>
      </TabsContent>
      <TabsContent value="search">
        <template #render="{ props }"><section v-bind="omitClass(props)" :class="contentClassName">Custom search panel.</section></template>
      </TabsContent>
    </TabsRoot>
  </Card>
</template>
