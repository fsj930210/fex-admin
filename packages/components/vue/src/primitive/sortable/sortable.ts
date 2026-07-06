import { sortableClassName, sortableItemClassName } from '@fex/components-styles/sortable'
import { cn, shallowEqualObject } from '@fex/utils'
import type { SortableAxis, SortableId, SortableItems } from '@fex/components-core/sortable/types'
import type { PropType } from 'vue'
import { Teleport, computed, defineComponent, h, inject, provide } from 'vue'
import { useSortable, type UseSortableOptions } from '../../composables/use-sortable'

const SORTABLE_CONTEXT = Symbol('sortable')

type SortableContext = ReturnType<typeof useSortable<SortableItems>>

export const SortableRoot = defineComponent({
  name: 'SortableRoot',
  props: {
    items: { type: [Array, Object] as PropType<SortableItems>, required: true },
    axis: { type: String as PropType<SortableAxis>, default: undefined },
    containerId: { type: String, default: 'default' },
    class: { type: String, default: undefined },
  },
  emits: {
    change: (_items: SortableItems) => true,
  },
  setup(props, { emit, slots, attrs }) {
    const handleChange = (items: SortableItems) => emit('change', items)
    const createOptions = (): UseSortableOptions<SortableItems> => ({
      items: props.items,
      ...(props.axis === undefined ? {} : { axis: props.axis }),
      onChange: handleChange,
    })
    let latestOptions = createOptions()
    const sortable = useSortable({
      ...latestOptions,
    })

    provide(SORTABLE_CONTEXT, sortable)

    return () => {
      const nextOptions = createOptions()
      if (!shallowEqualObject(latestOptions, nextOptions)) {
        latestOptions = nextOptions
        sortable.update(nextOptions)
      }

      return h(
        'div',
        {
          ...attrs,
          ref: sortable.setContainerRef(props.containerId),
          class: cn(sortableClassName, props.class),
          'data-sortable-container': props.containerId,
        },
          slots.default?.({ items: sortable.previewItems.value, sortable }),
      )
    }
  },
})

export const SortableItem = defineComponent({
  name: 'SortableItem',
  props: {
    id: { type: [String, Number] as PropType<SortableId>, required: true },
    containerId: { type: String, default: 'default' },
    class: { type: String, default: undefined },
  },
  setup(props, { slots, attrs }) {
    const sortable = useSortableContext()
    const active = computed(() => sortable.snapshot.value.activeId === props.id)

    return () =>
      h(
        'div',
        {
          ...attrs,
          ref: sortable.setItemRef(props.id, props.containerId),
          class: cn(sortableItemClassName, props.class),
          style: sortable.getItemStyle(props.id),
          'data-active': active.value || undefined,
          'data-sortable-id': props.id,
          'data-sortable-container-id': props.containerId,
          onPointerdown: (event: PointerEvent) => sortable.onItemPointerDown(event, props.id, props.containerId),
        },
        slots.default?.({ active: active.value, sortable }),
      )
  },
})

export const SortableHandle = defineComponent({
  name: 'SortableHandle',
  props: {
    class: { type: String, default: undefined },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'button',
        {
          ...attrs,
          type: 'button',
          class: cn('cursor-grab touch-none select-none active:cursor-grabbing', props.class),
          'data-sortable-handle': '',
        },
        slots.default?.(),
      )
  },
})

export const SortableOverlay = defineComponent({
  name: 'SortableOverlay',
  props: {
    class: { type: String, default: undefined },
  },
  setup(props, { slots, attrs }) {
    const sortable = useSortableContext()

    return () => {
      const activeId = sortable.snapshot.value.activeId
      if (!activeId) {
        return null
      }

      return h(Teleport, { to: 'body' }, [
        h(
          'div',
          {
            ...attrs,
            class: cn(
              sortableItemClassName,
              'bg-card text-foreground opacity-100 shadow-xl ring-1 ring-border/70',
              props.class,
            ),
            style: sortable.getOverlayStyle(),
            'data-sortable-overlay': '',
          },
          slots.default?.({ activeId, style: sortable.getOverlayStyle() }),
        ),
      ])
    }
  },
})

function useSortableContext() {
  const context = inject<SortableContext | null>(SORTABLE_CONTEXT, null)
  if (!context) {
    throw new Error('Sortable components must be used inside SortableRoot.')
  }

  return context
}

export const Sortable = {
  Root: SortableRoot,
  Item: SortableItem,
  Handle: SortableHandle,
  Overlay: SortableOverlay,
}
