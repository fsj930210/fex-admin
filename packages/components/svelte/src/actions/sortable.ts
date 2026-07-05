import { DEFAULT_SORTABLE_CONTAINER_ID, createSortableController } from '@fex/components-core/sortable/create-sortable-controller'
import type {
  SortableAxis,
  SortableControllerSnapshot,
  SortableId,
  SortableItems,
  SortableMotionOptions,
} from '@fex/components-core/sortable/types'

export interface SortableActionOptions<TItems extends SortableItems> {
  items: TItems
  axis?: SortableAxis
  disabled?: boolean
  animation?: SortableMotionOptions
  onChange?: (items: TItems) => void
  onSnapshot?: (snapshot: SortableControllerSnapshot) => void
}

export function createSortableAction<TItems extends SortableItems>(options: SortableActionOptions<TItems>) {
  const controller = createSortableController(options)
  const unsubscribe = controller.subscribe(() => options.onSnapshot?.(controller.getSnapshot()))
  const cleanups = new Set<() => void>()

  function container(node: HTMLElement, containerId = DEFAULT_SORTABLE_CONTAINER_ID) {
    const cleanup = controller.registerContainer(containerId, node)
    cleanups.add(cleanup)
    node.dataset.sortableContainer = containerId
    return {
      destroy() {
        cleanup()
        cleanups.delete(cleanup)
      },
    }
  }

  function item(node: HTMLElement, itemOptions: { id: SortableId; containerId?: string }) {
    const containerId = itemOptions.containerId ?? DEFAULT_SORTABLE_CONTAINER_ID
    const cleanup = controller.registerItem(itemOptions.id, containerId, node)
    cleanups.add(cleanup)
    node.dataset.sortableId = String(itemOptions.id)
    node.dataset.sortableContainerId = containerId

    function onPointerDown(event: PointerEvent) {
      if (options.disabled || !controller.startPointerDrag(toInput(event), itemOptions.id, containerId)) {
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

    node.addEventListener('pointerdown', onPointerDown)
    return {
      destroy() {
        node.removeEventListener('pointerdown', onPointerDown)
        cleanup()
        cleanups.delete(cleanup)
      },
    }
  }

  return {
    controller,
    container,
    item,
    getPreviewItems() {
      return controller.getPreviewItems()
    },
    getItemStyle(id: SortableId) {
      return controller.getItemStyle(id)
    },
    getMotionStyle(id: SortableId) {
      return controller.getMotionStyle(id)
    },
    getOverlayStyle() {
      return controller.getOverlayStyle()
    },
    destroy() {
      unsubscribe()
      for (const cleanup of cleanups) {
        cleanup()
      }
    },
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
