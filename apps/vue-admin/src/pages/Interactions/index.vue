<script setup lang="ts">
import Card from '@fex/components-vue/ui/card'
import { useDropzone } from '@fex/components-vue/composables/use-dropzone'
import { useMove } from '@fex/components-vue/composables/use-move'
import { useResize } from '@fex/components-vue/composables/use-resize'
import { ref } from 'vue'
import DraggableToken from './DraggableToken.vue'
import DroppableZone from './DroppableZone.vue'

const draggableItems = {
  'status-card': { id: 'status-card', label: 'Status card', type: 'card' },
  'owner-chip': { id: 'owner-chip', label: 'Owner chip', type: 'chip' },
} as const

const files = ref<string[]>([])
const dropResult = ref('Drop a draggable item into a zone.')
const dropDemoItems = ref({
  source: ['status-card', 'owner-chip'],
  'card-zone': [] as string[],
  'any-zone': [] as string[],
})
const dropzone = useDropzone({
  accept: ['image/*', '.txt'],
  multiple: true,
  onDropFiles: (nextFiles) => {
    files.value = nextFiles.map((file) => file.name)
  },
})
const move = useMove({ defaultPosition: { x: 24, y: 24 }, bounds: 'parent' })
const resize = useResize({
  defaultRect: { x: 24, y: 24, width: 320, height: 180 },
  edges: 'all',
  minWidth: 220,
  minHeight: 120,
})

function reportDrop(zoneId: 'card-zone' | 'any-zone', zone: string, source: Record<string, unknown>, edge: string | null) {
  const itemId = String(source.id)
  if (!(itemId in draggableItems)) {
    return
  }
  dropDemoItems.value = {
    source: dropDemoItems.value.source.filter((id) => id !== itemId),
    'card-zone': [
      ...dropDemoItems.value['card-zone'].filter((id) => id !== itemId),
      ...(zoneId === 'card-zone' ? [itemId] : []),
    ],
    'any-zone': [
      ...dropDemoItems.value['any-zone'].filter((id) => id !== itemId),
      ...(zoneId === 'any-zone' ? [itemId] : []),
    ],
  }
  dropResult.value = `${String(source.id)} dropped on ${zone}${edge ? ` at ${edge}` : ''}.`
}

function itemById(itemId: string) {
  return draggableItems[itemId as keyof typeof draggableItems]
}

</script>

<script lang="ts">
export default { name: 'InteractionsPage' }
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-xl">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</RouterLink>
        <div>
          <h1 class="text-2xl font-semibold text-foreground">Interactions</h1>
          <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
            Dropzone, movable, and 8-direction resize hooks for existing components.
          </p>
        </div>
      </header>

      <div class="space-y-space-xl">
        <Card title="Drag And Drop" description="useDraggable and useDroppable wrap shared drag-drop state for cross-component drops.">
          <div class="grid gap-space-md md:grid-cols-[280px_1fr]">
            <div class="space-y-space-sm rounded-md border border-border bg-background p-space-md">
              <p class="text-sm font-medium text-muted-foreground">Draggable items</p>
              <DraggableToken v-for="itemId in dropDemoItems.source" :key="itemId" v-bind="itemById(itemId)" />
              <p v-if="dropDemoItems.source.length === 0" class="rounded-md border border-dashed border-border px-space-md py-space-sm text-sm text-muted-foreground">
                All items have been dropped.
              </p>
            </div>
            <div class="grid gap-space-md md:grid-cols-2">
              <DroppableZone
                id="card-zone"
                title="Cards only"
                accept="card"
                :items="dropDemoItems['card-zone'].map(itemById)"
                @changed="dropResult = $event"
                @dropped="(source, edge) => reportDrop('card-zone', 'Cards only', source, edge)"
              />
              <DroppableZone
                id="any-zone"
                title="Any item"
                :items="dropDemoItems['any-zone'].map(itemById)"
                @changed="dropResult = $event"
                @dropped="(source, edge) => reportDrop('any-zone', 'Any item', source, edge)"
              />
            </div>
          </div>
          <p class="mt-space-md rounded-md bg-muted-background px-space-md py-space-sm text-sm text-muted-foreground">{{ dropResult }}</p>
        </Card>

        <Card title="Dropzone" description="The composable handles drag state, validation, and hidden input selection.">
          <div
            :ref="(element) => dropzone.setRoot(element as HTMLElement | null)"
            v-bind="dropzone.rootDataAttributes.value"
            class="flex min-h-32 cursor-pointer items-center justify-center rounded-md border border-dashed border-border bg-muted-background text-sm text-muted-foreground transition-colors data-[dragging=true]:border-ring data-[dragging=true]:bg-accent-background"
            @click="dropzone.open"
            @dragenter="dropzone.onDragEnter"
            @dragover="dropzone.onDragOver"
            @dragleave="dropzone.onDragLeave"
            @drop="dropzone.onDrop"
          >
            <input
              :ref="(element) => dropzone.setInput(element as HTMLInputElement | null)"
              type="file"
              hidden
              v-bind="dropzone.inputAttributes.value"
              @change="dropzone.onInputChange"
            />
            <span>{{ files.length > 0 ? files.join(', ') : 'Drop images or text files here' }}</span>
          </div>
        </Card>

        <Card title="Move" description="useMove adds draggable behavior to any existing element.">
          <div class="relative h-64 overflow-hidden rounded-md border border-border bg-background">
            <div :ref="(element) => move.setTarget(element as HTMLElement | null)" class="absolute w-72 overflow-hidden rounded-md border border-border bg-card shadow-lg" :style="move.style.value">
              <div :ref="(element) => move.setHandle(element as HTMLElement | null)" class="flex min-h-11 cursor-grab touch-none select-none items-center justify-between border-b border-border bg-muted-background px-space-md text-sm font-medium active:cursor-grabbing" @pointerdown="move.onPointerDown">
                <span>Drag this title bar</span><span class="text-muted-foreground">::</span>
              </div>
              <p class="p-space-md text-sm text-muted-foreground">The card is constrained to its parent. The title bar is the move handle.</p>
            </div>
          </div>
        </Card>

        <Card title="Resize" description="useResize supports edge and corner handles for floating surfaces.">
          <div class="relative h-80 overflow-hidden rounded-md border border-border bg-background">
            <div :ref="(element) => resize.setTarget(element as HTMLElement | null)" class="absolute rounded-md border border-border bg-card p-space-md shadow-lg" :style="resize.style.value">
              <p class="text-sm font-medium">Resizable surface</p>
              <p class="mt-space-sm text-sm text-muted-foreground">Drag any edge or corner. Handles are intentionally visible for this demo.</p>
              <div v-bind="resize.getHandleProps('top')" class="absolute left-4 right-4 top-0 z-10 h-2 cursor-n-resize rounded-b bg-primary/50 hover:bg-primary" />
              <div v-bind="resize.getHandleProps('right')" class="absolute bottom-4 right-0 top-4 z-10 w-2 cursor-e-resize rounded-l bg-primary/50 hover:bg-primary" />
              <div v-bind="resize.getHandleProps('bottom')" class="absolute bottom-0 left-4 right-4 z-10 h-2 cursor-s-resize rounded-t bg-primary/50 hover:bg-primary" />
              <div v-bind="resize.getHandleProps('left')" class="absolute bottom-4 left-0 top-4 z-10 w-2 cursor-w-resize rounded-r bg-primary/50 hover:bg-primary" />
              <div v-bind="resize.getHandleProps('top-left')" class="absolute left-0 top-0 z-20 size-6 cursor-nw-resize rounded-br bg-primary shadow-sm" />
              <div v-bind="resize.getHandleProps('top-right')" class="absolute right-0 top-0 z-20 size-6 cursor-ne-resize rounded-bl bg-primary shadow-sm" />
              <div v-bind="resize.getHandleProps('bottom-left')" class="absolute bottom-0 left-0 z-20 size-6 cursor-sw-resize rounded-tr bg-primary shadow-sm" />
              <div v-bind="resize.getHandleProps('bottom-right')" class="absolute bottom-0 right-0 z-20 size-6 cursor-se-resize rounded-tl bg-primary shadow-sm" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  </main>
</template>
