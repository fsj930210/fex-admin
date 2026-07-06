<script lang="ts">
  import type { SortableAxis, SortableControllerSnapshot, SortableItems } from '@fex/components-core/sortable/types'
  import type { Snippet } from 'svelte'
  import { onDestroy, setContext } from 'svelte'
  import { createSortableAction } from '../../actions/sortable'
  import { sortableContextKey, type SortableContext } from './sortable-context'

  interface SortableRootProps<TItems extends SortableItems = SortableItems> {
    items: TItems
    axis?: SortableAxis
    containerId?: string
    class?: string
    children?: Snippet<[{ items: TItems }]>
    onChange?: (items: TItems) => void
  }

  let {
    items,
    axis,
    containerId = 'default',
    class: className = 'flex flex-col gap-space-sm',
    children,
    onChange,
  }: SortableRootProps = $props()

  let snapshot = $state<SortableControllerSnapshot>({
    activeId: null,
    activeContainerId: null,
    overId: null,
    overContainerId: null,
    dragging: false,
    activeRect: null,
    dragOffset: { x: 0, y: 0 },
    items: {},
    motionVersion: 0,
  })
  function createOptions() {
    return {
    items,
      ...(axis === undefined ? {} : { axis }),
      onChange: (nextItems: SortableItems) => onChange?.(nextItems),
      onSnapshot: (nextSnapshot: SortableControllerSnapshot) => (snapshot = nextSnapshot),
    }
  }

  // svelte-ignore state_referenced_locally -- initial options create the stable controller; action update syncs later props.
  const sortable = createSortableAction(createOptions())

  function styleToString(style: object) {
    return (Object.entries(style) as Array<[string, string | number | undefined]>)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}:${value}`)
      .join(';')
  }

  function container(node: HTMLElement, options = createOptions()) {
    const registration = sortable.container(node, containerId)
    sortable.updateOptions(options)
    return {
      update(nextOptions: ReturnType<typeof createOptions>) {
        sortable.updateOptions(nextOptions)
      },
      destroy() {
        registration.destroy()
      },
    }
  }

  setContext<SortableContext>(sortableContextKey, {
    sortable,
    snapshot: () => snapshot,
    styleToString,
  })

  onDestroy(() => sortable.destroy())

  const previewItems = $derived.by(() => {
    void snapshot.motionVersion
    return sortable.getPreviewItems()
  })
</script>

<div use:container={createOptions()} class={className} data-sortable-container={containerId}>
  {@render children?.({ items: previewItems as SortableItems })}
</div>
