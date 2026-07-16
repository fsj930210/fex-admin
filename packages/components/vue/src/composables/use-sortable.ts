import {
  DEFAULT_SORTABLE_CONTAINER_ID,
  createSortableController,
} from '@fex/components-core/sortable/create-sortable-controller'
import { restoreSortableItems } from '@fex/components-core/sortable/containers'
import type {
  SortableAxis,
  SortableId,
  SortableItems,
  SortableMotionOptions,
} from '@fex/components-core/sortable/types'
import { computed, onBeforeUnmount, shallowRef } from 'vue'

export interface UseSortableOptions<TItems extends SortableItems> {
  items: TItems
  axis?: SortableAxis
  disabled?: boolean
  animation?: SortableMotionOptions
  onChange?: (items: TItems) => void
}

export function useSortable<TItems extends SortableItems>(options: UseSortableOptions<TItems>) {
  let currentOptions = options
  const controller = createSortableController(options)
  const snapshot = shallowRef(controller.getSnapshot())
  const cleanups = new Set<() => void>()
  const unsubscribe = controller.subscribe(() => {
    snapshot.value = controller.getSnapshot()
  })

  function update(next: UseSortableOptions<TItems>) {
    currentOptions = next
    controller.updateOptions(next)
  }

  function setContainerRef(containerId = DEFAULT_SORTABLE_CONTAINER_ID) {
    return (element: unknown) => {
      if (element instanceof HTMLElement) {
        cleanups.add(controller.registerContainer(containerId, element))
      }
    }
  }

  function setItemRef(id: SortableId, containerId = DEFAULT_SORTABLE_CONTAINER_ID) {
    return (element: unknown) => {
      if (element instanceof HTMLElement) {
        cleanups.add(controller.registerItem(id, containerId, element))
      }
    }
  }

  function onItemPointerDown(
    event: PointerEvent,
    id: SortableId,
    containerId = DEFAULT_SORTABLE_CONTAINER_ID,
  ) {
    if (currentOptions.disabled || !controller.startPointerDrag(toInput(event), id, containerId)) {
      return
    }

    function onPointerMove(pointerEvent: PointerEvent) {
      controller.updatePointer({
        clientX: pointerEvent.clientX,
        clientY: pointerEvent.clientY,
        preventDefault: () => pointerEvent.preventDefault(),
      })
    }

    function onPointerUp() {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      controller.endPointerDrag()
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp, { once: true })
  }

  onBeforeUnmount(() => {
    unsubscribe()
    for (const cleanup of cleanups) {
      cleanup()
    }
  })

  return {
    snapshot,
    previewItems: computed(() => restoreSortableItems(currentOptions.items, snapshot.value.items)),
    update,
    setContainerRef,
    setItemRef,
    onItemPointerDown,
    getItemStyle: (id: SortableId) => {
      void snapshot.value
      return controller.getItemStyle(id) as Record<string, string | number | undefined>
    },
    getMotionStyle: (id: SortableId) => {
      void snapshot.value
      return controller.getMotionStyle(id) as Record<string, string | number | undefined>
    },
    getOverlayStyle: () => {
      void snapshot.value
      return controller.getOverlayStyle() as Record<string, string | number | undefined>
    },
    registerMotionTarget: (id: SortableId, element: HTMLElement | null) =>
      controller.registerMotionTarget(id, element),
  }
}

function toInput(event: PointerEvent) {
  return {
    button: event.button,
    clientX: event.clientX,
    clientY: event.clientY,
    currentTarget: event.currentTarget as HTMLElement,
    preventDefault: () => event.preventDefault(),
  }
}
