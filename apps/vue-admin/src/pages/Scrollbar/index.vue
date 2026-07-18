<script setup lang="ts">
import { ScrollbarBar, ScrollbarCorner, ScrollbarRoot, ScrollbarThumb, ScrollbarTrack, ScrollbarViewport } from '@fex/components-vue/primitive/scrollbar'
import Card from '@fex/components-vue/ui/card'
import { computed, ref } from 'vue'

const items = Array.from({ length: 28 }, (_, index) => index + 1)
const rows = Array.from({ length: 30 }, (_, index) => index + 1)
const virtualRowHeight = 40
const virtualRowCount = 300
const virtualScrollTop = ref(0)
const virtualStart = computed(() => Math.floor(virtualScrollTop.value / virtualRowHeight))
const virtualRows = computed(() =>
  Array.from({ length: 14 }, (_, index) => virtualStart.value + index + 1).filter((row) => row <= virtualRowCount),
)

function handleVirtualScroll({ scrollTop }: { scrollTop: number }) {
  virtualScrollTop.value = scrollTop
}
</script>
<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-md">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</RouterLink>
        <div>
          <h1 class="text-2xl font-semibold text-foreground">Scrollbar</h1>
          <p class="mt-space-sm text-sm text-muted-foreground">Primitive overlay scrollbar with native scrolling.</p>
        </div>
      </header>

      <div class="grid gap-space-xl lg:grid-cols-2">
        <Card title="Vertical" description="Single vertical Bar.">
          <ScrollbarRoot class="h-72 rounded-md border">
            <ScrollbarViewport overflow-x="hidden">
              <div class="space-y-2 p-3">
                <div v-for="item in items" :key="item" class="rounded-md border border-border p-3 text-sm">Activity {{ item }}</div>
              </div>
            </ScrollbarViewport>
            <ScrollbarBar axis="y" />
          </ScrollbarRoot>
        </Card>

        <Card title="Horizontal" description="Single horizontal Bar.">
          <ScrollbarRoot class="h-40 rounded-md border">
            <ScrollbarViewport overflow-y="hidden">
              <div class="flex w-max gap-3 p-3">
                <div v-for="item in items" :key="item" class="grid size-28 shrink-0 place-items-center rounded-md border border-border text-sm">Card {{ item }}</div>
              </div>
            </ScrollbarViewport>
            <ScrollbarBar axis="x" />
          </ScrollbarRoot>
        </Card>

        <Card title="Both axes" description="Independent floating Bars.">
          <ScrollbarRoot class="h-72 rounded-md border">
            <ScrollbarViewport>
              <div class="grid h-140 w-190 grid-cols-5 gap-3 p-3">
                <div v-for="item in items" :key="item" class="grid h-24 place-items-center rounded-md border border-border">{{ item }}</div>
              </div>
            </ScrollbarViewport>
            <ScrollbarBar axis="y" />
            <ScrollbarBar axis="x" />
            <ScrollbarCorner />
          </ScrollbarRoot>
        </Card>

        <Card title="Inset visible tracks" description="Tracks are opt-in; this rail starts below the fixed toolbar.">
          <ScrollbarRoot auto-hide="never" class="h-72 rounded-md border">
            <div class="h-12 border-b border-border bg-muted-background px-3 py-3 text-sm font-medium">Fixed toolbar</div>
            <ScrollbarViewport class="h-[calc(100%-3rem)]">
              <div class="space-y-2 p-3">
                <div v-for="item in items" :key="item" class="rounded-md border border-border bg-background p-3 text-sm">Activity item {{ item }}</div>
              </div>
            </ScrollbarViewport>
            <ScrollbarBar axis="y" class="top-12">
              <ScrollbarTrack axis="y" class="bg-muted-background/90">
                <ScrollbarThumb axis="y" class="bg-primary/70 hover:bg-primary" />
              </ScrollbarTrack>
            </ScrollbarBar>
            <ScrollbarBar axis="x" class="start-20">
              <ScrollbarTrack axis="x" class="bg-muted-background/90">
                <ScrollbarThumb axis="x" class="bg-primary/70 hover:bg-primary" />
              </ScrollbarTrack>
            </ScrollbarBar>
            <ScrollbarCorner />
          </ScrollbarRoot>
        </Card>
      </div>

      <Card title="Scroll events · virtual list" description="The scroll event updates only the rendered window; 300 rows keep native scrolling.">
        <ScrollbarRoot class="h-72 rounded-md border" @scroll-change="handleVirtualScroll">
          <ScrollbarViewport overflow-x="hidden">
            <div class="relative h-[12000px]">
              <div class="absolute inset-x-0" :style="{ transform: `translateY(${virtualStart * virtualRowHeight}px)` }">
                <div v-for="row in virtualRows" :key="row" class="flex h-10 items-center border-b border-border px-3 text-sm">
                  Virtual activity {{ row }}
                </div>
              </div>
            </div>
          </ScrollbarViewport>
          <ScrollbarBar axis="y" />
        </ScrollbarRoot>
      </Card>

      <Card title="Data grid scroll" description="Plain table in a native viewport; layout controls the Bar track geometry.">
        <ScrollbarRoot class="h-96 rounded-md border">
          <ScrollbarViewport>
            <table class="w-full min-w-[1500px] text-left text-sm">
              <thead class="sticky top-0 bg-muted-background">
                <tr>
                  <th v-for="column in ['ID','Name','Status','Amount','Region']" :key="column" class="border-b border-border px-4 py-3">{{ column }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in rows" :key="row" class="border-b border-border">
                  <td v-for="column in 5" :key="column" class="px-4 py-3">{{ column === 1 ? row : `Value ${row}` }}</td>
                </tr>
              </tbody>
            </table>
          </ScrollbarViewport>
          <ScrollbarBar axis="y" class="top-12" />
          <ScrollbarBar axis="x" />
          <ScrollbarCorner />
        </ScrollbarRoot>
      </Card>
    </div>
  </main>
</template>
