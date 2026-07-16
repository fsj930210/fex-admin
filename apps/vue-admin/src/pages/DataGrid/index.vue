<script setup lang="ts">
import BasicDemo from './basic-demo.vue'
import HeaderGroupingDemo from './header-grouping-demo.vue'
import SortingDemo from './sorting-demo.vue'
import FilteringDemo from './filtering-demo.vue'
import PaginationDemo from './pagination-demo.vue'
import SelectionDemo from './selection-demo.vue'
import ExpansionDemo from './expansion-demo.vue'
import VisibilityDemo from './visibility-demo.vue'
import OrderingDemo from './ordering-demo.vue'
import DndDemo from './dnd-demo.vue'
import ColumnPinningDemo from './column-pinning-demo.vue'
import RowPinningDemo from './row-pinning-demo.vue'
import SizingDemo from './sizing-demo.vue'
import GroupingDemo from './grouping-demo.vue'
import VirtualDemo from './virtual-demo.vue'
import CellEditingDemo from './cell-editing-demo.vue'
import RowEditingDemo from './row-editing-demo.vue'
import PresentationDemo from './presentation-demo.vue'
</script>
<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-[1600px] space-y-space-xl">
      <header class="space-y-space-sm">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/"
          >Back home</RouterLink
        >
        <div>
          <h1 class="text-2xl font-semibold text-foreground">Data Grid primitive</h1>
          <p class="max-w-4xl text-sm leading-6 text-muted-foreground">
            Vue adapter for the shared TanStack Table v9 core controller.
          </p>
        </div>
      </header>
      <div class="space-y-space-xl">
        <BasicDemo /><HeaderGroupingDemo /><SortingDemo /><FilteringDemo /><PaginationDemo /><SelectionDemo /><ExpansionDemo /><VisibilityDemo /><OrderingDemo /><DndDemo /><ColumnPinningDemo /><RowPinningDemo /><SizingDemo /><GroupingDemo /><VirtualDemo /><CellEditingDemo /><RowEditingDemo /><PresentationDemo />
      </div>
    </div>
  </main>
</template>
