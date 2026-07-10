import {
  DEFAULT_SORTABLE_CONTAINER_ID,
  createSortableController,
} from '@fex/components-core/sortable/create-sortable-controller'
import { restoreSortableItems } from '@fex/components-core/sortable/containers'
import { useRef, useSyncExternalStore } from 'react'
import type { CSSProperties, HTMLAttributes, PointerEvent, RefCallback } from 'react'
import type { SortableAxis, SortableId, SortableItems, SortableMotionOptions } from '@fex/components-core/sortable/types'
import { shallowEqualObject } from '@fex/utils'
import { useLazyRef } from './use-lazy-ref'
import { useMemoizedFn } from './use-memoized-fn'

type DataAttributes = {
  [key: `data-${string}`]: string | boolean | undefined
}

export interface UseSortableOptions<TItems extends SortableItems> {
  items: TItems
  axis?: SortableAxis | undefined
  disabled?: boolean
  animation?: SortableMotionOptions | undefined
  onChange?: ((items: TItems) => void) | undefined
}

export function useSortable<TItems extends SortableItems>({
  items,
  axis,
  disabled,
  animation,
  onChange,
}: UseSortableOptions<TItems>) {
  const controllerOptions = { items, axis, animation, onChange }
  const latestOptionsRef = useRef(controllerOptions)
  const controller = useLazyRef(() => createSortableController(controllerOptions)).current
  const snapshot = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  )

  if (!shallowEqualObject(latestOptionsRef.current, controllerOptions)) {
    latestOptionsRef.current = controllerOptions
    controller.updateOptions(controllerOptions)
  }

  const getContainerProps = useMemoizedFn(
    (containerId = DEFAULT_SORTABLE_CONTAINER_ID): HTMLAttributes<HTMLElement> & DataAttributes & { ref: RefCallback<HTMLElement> } => {
      let cleanup: (() => void) | undefined

      return {
        ref: (element) => {
          cleanup?.()
          cleanup = element ? controller.registerContainer(containerId, element) : undefined
        },
        'data-sortable-container': containerId,
      }
    },
  )

  const getItemProps = useMemoizedFn(
    (id: SortableId, containerId = DEFAULT_SORTABLE_CONTAINER_ID):
      HTMLAttributes<HTMLElement> & DataAttributes & { ref: RefCallback<HTMLElement> } => {
      let cleanup: (() => void) | undefined

      return {
        ref: (element) => {
          cleanup?.()
          cleanup = element ? controller.registerItem(id, containerId, element) : undefined
        },
        'data-sortable-id': id,
        'data-sortable-container-id': containerId,
        'data-dragging': snapshot.activeId === id || undefined,
        onPointerDown: (event) => {
          if (disabled || !controller.startPointerDrag(eventToInput(event), id, containerId)) {
            return
          }

          function onPointerMove(pointerEvent: globalThis.PointerEvent) {
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
        },
        style: controller.getItemStyle(id) as CSSProperties,
      }
    },
  )

  const getHandleProps = useMemoizedFn((): HTMLAttributes<HTMLElement> & DataAttributes => ({
    'data-sortable-handle': '',
  }))

  const getMotionStyle = useMemoizedFn((id: SortableId): CSSProperties =>
    controller.getMotionStyle(id) as CSSProperties,
  )

  const getOverlayStyle = useMemoizedFn((): CSSProperties =>
    controller.getOverlayStyle() as CSSProperties,
  )

  const registerMotionTarget = useMemoizedFn((id: SortableId, element: HTMLElement | null) =>
    controller.registerMotionTarget(id, element),
  )

  return {
    ...snapshot,
    previewItems: restoreSortableItems(items, snapshot.items),
    getContainerProps,
    getItemProps,
    getHandleProps,
    getMotionStyle,
    getOverlayStyle,
    registerMotionTarget,
  }
}

function eventToInput(event: PointerEvent<HTMLElement>) {
  return {
    button: event.button,
    clientX: event.clientX,
    clientY: event.clientY,
    currentTarget: event.currentTarget,
    preventDefault: () => event.preventDefault(),
  }
}
