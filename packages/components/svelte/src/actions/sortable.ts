import { DEFAULT_SORTABLE_CONTAINER_ID, createSortableController } from '@fex/components-core/sortable/create-sortable-controller'
import type {
  SortableAxis,
  SortableControllerSnapshot,
  SortableId,
  SortableItems,
  SortableMotionOptions,
} from '@fex/components-core/sortable/types'

const sortableItemStyleProperties = [
  'width',
  'height',
  'minWidth',
  'minHeight',
  'boxSizing',
  'flexShrink',
  'visibility',
  'transition',
  'transform',
] as const
type SortableItemStyleProperty = (typeof sortableItemStyleProperties)[number]
type SortableItemStyle = Partial<Record<SortableItemStyleProperty, string | number | undefined>>

export interface SortableActionOptions<TItems extends SortableItems> {
  items: TItems
  axis?: SortableAxis
  disabled?: boolean
  animation?: SortableMotionOptions
  onChange?: (items: TItems) => void
  onSnapshot?: (snapshot: SortableControllerSnapshot) => void
}

export function createSortableAction<TItems extends SortableItems>(options: SortableActionOptions<TItems>) {
  let currentOptions = options
  const controller = createSortableController(options)
  const unsubscribe = controller.subscribe(() => currentOptions.onSnapshot?.(controller.getSnapshot()))
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
    const previousTouchAction = node.style.touchAction
    node.style.touchAction = 'none'
    const applyStyle = () => {
      const style = controller.getItemStyle(itemOptions.id) as SortableItemStyle
      for (const property of sortableItemStyleProperties) {
        const value = style[property]
        node.style[property] = value === undefined ? '' : String(value)
      }
    }
    const unsubscribeItemStyle = controller.subscribe(applyStyle)
    let cleanupPointerSession: (() => void) | undefined
    let draggingThisItem = false

    function onPointerDown(event: PointerEvent) {
      if (currentOptions.disabled || !controller.startPointerDrag(toInput(event), itemOptions.id, containerId)) {
        return
      }
      draggingThisItem = true

      function onPointerMove(pointerEvent: PointerEvent) {
        controller.updatePointer({
          clientX: pointerEvent.clientX,
          clientY: pointerEvent.clientY,
          preventDefault: () => pointerEvent.preventDefault(),
        })
      }

      function onPointerUp() {
        cleanupPointerSession?.()
        controller.endPointerDrag()
        draggingThisItem = false
      }

      cleanupPointerSession?.()
      cleanupPointerSession = () => {
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerup', onPointerUp)
        window.removeEventListener('pointercancel', onPointerUp)
        cleanupPointerSession = undefined
      }
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp, { once: true })
      window.addEventListener('pointercancel', onPointerUp, { once: true })
    }

    node.addEventListener('pointerdown', onPointerDown)
    applyStyle()
    return {
      destroy() {
        // Preview reorders may replace this node before pointerup. Keep the
        // window-level session alive so the controller can commit the drag.
        if (!draggingThisItem) {
          cleanupPointerSession?.()
        }
        node.removeEventListener('pointerdown', onPointerDown)
        node.style.touchAction = previousTouchAction
        cleanup()
        cleanups.delete(cleanup)
        unsubscribeItemStyle()
      },
    }
  }

  return {
    controller,
    updateOptions(nextOptions: SortableActionOptions<TItems>) {
      currentOptions = nextOptions
      controller.updateOptions(nextOptions)
      currentOptions.onSnapshot?.(controller.getSnapshot())
    },
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
