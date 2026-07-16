<script lang="ts">
  import BasicDemo from './basic-demo.svelte'
  import HeaderGroupingDemo from './header-grouping-demo.svelte'
  import SortingDemo from './sorting-demo.svelte'
  import FilteringDemo from './filtering-demo.svelte'
  import PaginationDemo from './pagination-demo.svelte'
  import SelectionDemo from './selection-demo.svelte'
  import ExpansionDemo from './expansion-demo.svelte'
  import VisibilityDemo from './visibility-demo.svelte'
  import OrderingDemo from './ordering-demo.svelte'
  import DndDemo from './dnd-demo.svelte'
  import ColumnPinningDemo from './column-pinning-demo.svelte'
  import RowPinningDemo from './row-pinning-demo.svelte'
  import SizingDemo from './sizing-demo.svelte'
  import GroupingDemo from './grouping-demo.svelte'
  import VirtualDemo from './virtual-demo.svelte'
  import CellEditingDemo from './cell-editing-demo.svelte'
  import RowEditingDemo from './row-editing-demo.svelte'
  import PresentationDemo from './presentation-demo.svelte'
</script>

<svelte:head><title>DataGrid · Svelte Admin</title></svelte:head>
<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-[1600px] space-y-space-xl">
    <header class="space-y-space-sm"><a class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</a><h1 class="text-2xl font-semibold text-foreground">Data Grid primitive</h1><p class="max-w-4xl text-sm leading-6 text-muted-foreground">Svelte adapter for TanStack Table v9 beta. Every capability is registered independently; the primitive renders the resulting table instance and leaves requests, DnD policy and business UI to callers.</p></header>
    <div class="space-y-space-xl"><BasicDemo /><HeaderGroupingDemo /><SortingDemo /><FilteringDemo /><PaginationDemo /><SelectionDemo /><ExpansionDemo /><VisibilityDemo /><OrderingDemo /><DndDemo /><ColumnPinningDemo /><RowPinningDemo /><SizingDemo /><GroupingDemo /><VirtualDemo /><CellEditingDemo /><RowEditingDemo /><PresentationDemo /></div>
  </div>
</main>
