<script lang="ts">
  import type { SortableId } from '@fex/components-core/sortable/types'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { sortableContextKey, type SortableContext } from './sortable-context'

  interface SortableItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'children'> {
    id: SortableId
    containerId?: string
    class?: string
    children?: Snippet
  }

  let { id, containerId = 'default', class: className, children, ...rest }: SortableItemProps = $props()
  const { sortable, snapshot, styleToString } = getContext<SortableContext>(sortableContextKey)

  function item(node: HTMLElement) {
    return sortable.item(node, { id, containerId })
  }

  const itemStyle = $derived(styleToString((snapshot().motionVersion, sortable.getItemStyle(id))))
  const active = $derived(snapshot().activeId === id)
</script>

<div
  {...rest}
  use:item
  class={cn(
    'flex min-h-12 cursor-grab touch-none select-none items-center gap-space-sm rounded-md border border-border bg-card px-space-md text-sm font-medium shadow-sm transition-[transform,box-shadow,background-color,opacity] hover:bg-muted-background hover:shadow-md active:cursor-grabbing data-[active]:shadow-lg',
    className,
  )}
  style={itemStyle}
  data-active={active || undefined}
  data-sortable-id={id}
  data-sortable-container-id={containerId}
>
  {@render children?.()}
</div>
