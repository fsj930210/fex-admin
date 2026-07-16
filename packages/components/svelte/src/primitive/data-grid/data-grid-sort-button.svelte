<script lang="ts" generics="TFeatures extends TableFeatures, TData extends RowData">
  import { dataGridSortButtonClassName } from '@fex/components-styles/data-grid'
  import type { Column, RowData, TableFeatures } from '@tanstack/table-core'
  import ChevronRightIcon from '../../icon/chevron-right.svelte'
  import Button from '../../ui/button/button.svelte'

  interface SortableColumn {
    getCanSort(): boolean
    getIsSorted(): false | 'asc' | 'desc'
    getSortIndex(): number
    getToggleSortingHandler(): ((event: MouseEvent) => void) | undefined
  }

  let { column, children }: { column: Column<TFeatures, TData>; children?: import('svelte').Snippet } = $props()
  const direction = $derived((column as unknown as SortableColumn).getIsSorted())
  const sortIndex = $derived((column as unknown as SortableColumn).getSortIndex())
</script>

<Button
  type="button"
  variant="ghost"
  disabled={!(column as unknown as SortableColumn).getCanSort()}
  aria-pressed={Boolean(direction)}
  class={dataGridSortButtonClassName}
  onclick={(event) => (column as unknown as SortableColumn).getToggleSortingHandler()?.(event)}
>
  <span>{@render children?.()}</span>
  <span class="inline-flex items-center" aria-hidden="true">
    {#if direction === 'asc'}
      <ChevronRightIcon class="size-3.5 -rotate-90" />
    {:else if direction === 'desc'}
      <ChevronRightIcon class="size-3.5 rotate-90" />
    {:else}
      <span class="relative inline-block size-3.5"><ChevronRightIcon class="absolute inset-x-0 top-0 size-3 -rotate-90" /><ChevronRightIcon class="absolute inset-x-0 bottom-0 size-3 rotate-90" /></span>
    {/if}
    {#if direction && sortIndex >= 0}<sup>{sortIndex + 1}</sup>{/if}
  </span>
</Button>
