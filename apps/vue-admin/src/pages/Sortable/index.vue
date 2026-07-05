<script setup lang="ts">
import Card from '@fex/components-vue/ui/card'
import { useSortable } from '@fex/components-vue/composables/use-sortable'
import { computed, ref } from 'vue'

const initialTasks = ['Backlog', 'Design', 'Build', 'Review']
const initialPanels = {
  source: ['Name', 'Role', 'Email'],
  target: ['Status', 'Created at'],
}
const initialColumns = ['name', 'role', 'email', 'status']
const rows = [
  { name: 'Alice Johnson', role: 'Engineer', email: 'alice@example.com', status: 'Active' },
  { name: 'Bob Smith', role: 'Designer', email: 'bob@example.com', status: 'Active' },
  { name: 'Charlie Brown', role: 'Manager', email: 'charlie@example.com', status: 'Away' },
]
const columnLabels: Record<string, string> = {
  name: 'Name',
  role: 'Role',
  email: 'Email',
  status: 'Status',
}

const tasks = ref(initialTasks)
const panels = ref(initialPanels)
const columns = ref(initialColumns)
const listSortable = useSortable({ items: tasks.value, axis: 'y', onChange: updateTasks })
const panelSortable = useSortable({ items: panels.value, onChange: updatePanels })
const tableSortable = useSortable({ items: columns.value, axis: 'x', onChange: updateColumns })

function updateTasks(items: string[]) {
  tasks.value = items
  listSortable.update({ items, axis: 'y', onChange: updateTasks })
}

function updatePanels(items: typeof initialPanels) {
  panels.value = items
  panelSortable.update({ items, onChange: updatePanels })
}

function updateColumns(items: string[]) {
  columns.value = items
  tableSortable.update({ items, axis: 'x', onChange: updateColumns })
}

const previewTasks = computed(() => listSortable.previewItems.value as string[])
const previewPanels = computed(() => panelSortable.previewItems.value as typeof initialPanels)
const previewColumns = computed(() => tableSortable.previewItems.value as string[])
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-xl">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</RouterLink>
        <div>
          <h1 class="text-2xl font-semibold text-foreground">Sortable</h1>
          <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
            Quick sortable components for common lists, plus useSortable for table columns and other custom layouts.
          </p>
        </div>
      </header>

      <div class="space-y-space-xl">
        <Card title="List" description="Drag any row. Items swap while you move, not only after drop.">
          <div :ref="listSortable.setContainerRef()" class="space-y-space-sm">
            <div
              v-for="task in previewTasks"
              :key="task"
              :ref="listSortable.setItemRef(task)"
              :data-sortable-id="task"
              class="flex min-h-12 cursor-grab touch-none select-none items-center gap-space-sm rounded-md border border-border bg-card px-space-md text-sm font-medium shadow-sm transition-[transform,box-shadow,background-color,opacity] hover:bg-muted-background hover:shadow-md active:cursor-grabbing"
              :style="listSortable.getItemStyle(task)"
              :data-dragging="listSortable.snapshot.value.activeId === task || undefined"
              @pointerdown="(event) => listSortable.onItemPointerDown(event, task)"
            >
              <span class="grid size-7 place-items-center rounded-md bg-muted-background text-muted-foreground">::</span>
              {{ task }}
            </div>
          </div>
          <Teleport to="body">
            <div
              v-if="typeof listSortable.snapshot.value.activeId === 'string'"
              data-sortable-overlay
              class="flex min-h-12 items-center gap-space-sm rounded-md border border-border bg-card px-space-md text-sm font-medium text-foreground opacity-100 shadow-xl ring-1 ring-border/70"
              :style="listSortable.getOverlayStyle()"
            >
              <span class="grid size-7 place-items-center rounded-md bg-muted-background text-muted-foreground">::</span>
              {{ listSortable.snapshot.value.activeId }}
            </div>
          </Teleport>
        </Card>

        <Card title="Multiple Containers" description="The same sortable hook supports transfer panels.">
          <div class="grid gap-space-md md:grid-cols-2">
            <div
              v-for="(items, containerId) in previewPanels"
              :key="containerId"
              :ref="panelSortable.setContainerRef(String(containerId))"
              class="min-h-56 rounded-md border border-border bg-background p-space-md"
            >
              <h2 class="mb-space-md text-sm font-medium capitalize text-muted-foreground">{{ containerId }}</h2>
              <div
                v-for="item in items"
                :key="item"
                :ref="panelSortable.setItemRef(item, String(containerId))"
                :data-sortable-id="item"
                class="mb-space-sm flex min-h-11 cursor-grab touch-none select-none items-center gap-space-sm rounded-md border border-border bg-card px-space-md text-sm font-medium shadow-sm transition-[transform,box-shadow,background-color,opacity] hover:bg-muted-background hover:shadow-md active:cursor-grabbing"
                :style="panelSortable.getItemStyle(item)"
                @pointerdown="(event) => panelSortable.onItemPointerDown(event, item, String(containerId))"
              >
                <span class="grid size-7 place-items-center rounded-md bg-muted-background text-muted-foreground">::</span>
                {{ item }}
              </div>
            </div>
          </div>
          <Teleport to="body">
            <div
              v-if="typeof panelSortable.snapshot.value.activeId === 'string'"
              data-sortable-overlay
              class="flex min-h-11 items-center gap-space-sm rounded-md border border-border bg-card px-space-md text-sm font-medium text-foreground opacity-100 shadow-xl ring-1 ring-border/70"
              :style="panelSortable.getOverlayStyle()"
            >
              <span class="grid size-7 place-items-center rounded-md bg-muted-background text-muted-foreground">::</span>
              {{ panelSortable.snapshot.value.activeId }}
            </div>
          </Teleport>
        </Card>

        <Card title="Table Columns" description="useSortable can share motion styles across header and body cells.">
          <div :ref="tableSortable.setContainerRef()" class="overflow-hidden rounded-md border border-border bg-background">
            <table class="w-full table-fixed border-collapse text-sm">
              <thead>
                <tr>
                  <th
                    v-for="column in previewColumns"
                    :key="column"
                    :ref="tableSortable.setItemRef(column)"
                    :data-sortable-id="column"
                    class="cursor-grab touch-none select-none border-b border-border bg-card px-space-md py-space-md text-left font-medium text-muted-foreground transition-[transform,background-color,box-shadow,opacity] hover:bg-muted-background active:cursor-grabbing"
                    :style="tableSortable.getItemStyle(column)"
                    @pointerdown="(event) => tableSortable.onItemPointerDown(event, column)"
                  >
                    <span class="inline-flex items-center gap-space-sm"><span class="text-muted-foreground">::</span>{{ columnLabels[column] }}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in rows" :key="row.email" class="border-b border-border last:border-0">
                  <td
                    v-for="column in previewColumns"
                    :key="column"
                    class="px-space-md py-space-sm"
                    :style="{ ...tableSortable.getMotionStyle(column), visibility: tableSortable.snapshot.value.activeId === column ? 'hidden' : undefined }"
                  >
                    {{ row[column as keyof typeof row] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Teleport to="body">
            <div
              v-if="typeof tableSortable.snapshot.value.activeId === 'string'"
              data-sortable-overlay
              class="overflow-hidden rounded-md border border-border bg-card text-sm text-foreground opacity-100 shadow-xl ring-1 ring-border/70"
              :style="{ ...tableSortable.getOverlayStyle(), height: 'auto' }"
            >
              <div class="flex min-h-12 items-center gap-space-sm border-b border-border px-space-md font-medium text-muted-foreground">
                <span>::</span>
                {{ columnLabels[tableSortable.snapshot.value.activeId] }}
              </div>
              <div v-for="row in rows" :key="row.email" class="border-b border-border px-space-md py-space-sm last:border-0">
                {{ row[tableSortable.snapshot.value.activeId as keyof typeof row] }}
              </div>
            </div>
          </Teleport>
        </Card>
      </div>
    </div>
  </main>
</template>
