import {
  DEFAULT_SORTABLE_CONTAINER_ID,
  findSortableLocation,
  moveSortableItem,
  normalizeSortableItems,
  restoreSortableItems,
} from './containers'
import { SortableMotionRegistry } from './motion'
import type {
  RectLike,
  SortableAxis,
  SortableControllerSnapshot,
  SortableId,
  SortableItems,
  SortableMotionOptions,
  SortableOverlayRect,
} from './types'

export interface SortableControllerOptions<TItems extends SortableItems> {
  items: TItems
  axis?: SortableAxis
  animation?: SortableMotionOptions
  onChange?: (items: TItems) => void
}

export interface SortablePointerInput {
  button: number
  clientX: number
  clientY: number
  currentTarget: HTMLElement
  preventDefault?: () => void
}

export interface SortablePointerMoveInput {
  clientX: number
  clientY: number
  preventDefault?: () => void
}

interface SortablePointerDrag {
  id: SortableId
  containerId: string
  activeRect: SortableOverlayRect
}

type Listener = () => void

export function createSortableController<TItems extends SortableItems>({
  items,
  axis,
  animation,
  onChange,
}: SortableControllerOptions<TItems>) {
  let originalItems = items
  let previewItems = normalizeSortableItems(items)
  let snapshot: SortableControllerSnapshot = {
    activeId: null,
    activeContainerId: null,
    overId: null,
    overContainerId: null,
    dragging: false,
    items: previewItems,
    dragOffset: { x: 0, y: 0 },
    activeRect: null,
    motionVersion: 0,
  }
  let pointerDrag: SortablePointerDrag | null = null
  let pointerStart = { x: 0, y: 0 }

  const listeners = new Set<Listener>()
  const itemElements = new Map<string, HTMLElement>()
  const containerElements = new Map<string, HTMLElement>()
  const motion = new SortableMotionRegistry()

  function getSnapshot() {
    return snapshot
  }

  function subscribe(listener: Listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  function notify() {
    snapshot = { ...snapshot, motionVersion: snapshot.motionVersion + 1 }
    for (const listener of listeners) {
      listener()
    }
  }

  function setSnapshot(next: Partial<SortableControllerSnapshot>) {
    snapshot = { ...snapshot, ...next }
    for (const listener of listeners) {
      listener()
    }
  }

  function updateOptions(next: SortableControllerOptions<TItems>) {
    originalItems = next.items
    axis = next.axis
    animation = next.animation
    onChange = next.onChange

    if (!snapshot.dragging) {
      previewItems = normalizeSortableItems(next.items)
      setSnapshot({ items: previewItems })
    }
  }

  function getPreviewItems() {
    return restoreSortableItems(originalItems, previewItems)
  }

  function registerItem(id: SortableId, containerId: string, element: HTMLElement) {
    itemElements.set(getItemKey(id, containerId), element)
    const cleanupMotion = motion.register(id, {
      getRect: () => element.getBoundingClientRect(),
    })

    return () => {
      itemElements.delete(getItemKey(id, containerId))
      cleanupMotion()
    }
  }

  function registerMotionTarget(id: SortableId, element: HTMLElement | null) {
    if (!element) {
      return undefined
    }

    return motion.register(id, {
      getRect: () => element.getBoundingClientRect(),
    })
  }

  function registerContainer(containerId: string, element: HTMLElement) {
    containerElements.set(containerId, element)
    return () => {
      containerElements.delete(containerId)
    }
  }

  function startPointerDrag(input: SortablePointerInput, id: SortableId, containerId: string) {
    if (input.button !== 0) {
      return false
    }

    input.preventDefault?.()
    const rect = input.currentTarget.getBoundingClientRect()
    const activeRect = toOverlayRect(rect)
    pointerDrag = { id, containerId, activeRect }
    pointerStart = { x: input.clientX, y: input.clientY }
    motion.measureFirst()
    setSnapshot({
      activeId: id,
      activeContainerId: containerId,
      overId: null,
      overContainerId: null,
      dragging: true,
      activeRect,
      dragOffset: { x: 0, y: 0 },
      items: previewItems,
    })

    return true
  }

  function updatePointer(input: SortablePointerMoveInput) {
    const active = pointerDrag
    if (!active) {
      return
    }

    input.preventDefault?.()
    const dragOffset = {
      x: axis === 'y' ? 0 : input.clientX - pointerStart.x,
      y: axis === 'x' ? 0 : input.clientY - pointerStart.y,
    }
    const containerId = getContainerIdAtPoint(input.clientX, input.clientY) ?? active.containerId
    const nextItems = getNextItemsFromPointer(active, containerId, dragOffset)

    setSnapshot({
      activeId: active.id,
      activeContainerId: active.containerId,
      overId: getOverId(containerId, input.clientX, input.clientY),
      overContainerId: containerId,
      dragging: true,
      dragOffset,
    })

    if (nextItems !== previewItems) {
      scheduleMotion(nextItems)
    }
  }

  function endPointerDrag() {
    const nextItems = previewItems
    pointerDrag = null
    setSnapshot({
      activeId: null,
      activeContainerId: null,
      overId: null,
      overContainerId: null,
      dragging: false,
      activeRect: null,
      dragOffset: { x: 0, y: 0 },
    })
    motion.clear()
    notify()
    onChange?.(restoreSortableItems(originalItems, nextItems))
  }

  function getItemStyle(id: SortableId) {
    if (snapshot.activeId === id && snapshot.dragging) {
      return {
        width: snapshot.activeRect?.width,
        height: snapshot.activeRect?.height,
        minWidth: snapshot.activeRect?.width,
        minHeight: snapshot.activeRect?.height,
        boxSizing: 'border-box',
        flexShrink: 0,
        visibility: 'hidden',
        transition: 'none',
      } as const
    }

    return motion.getStyle(id)
  }

  function getMotionStyle(id: SortableId) {
    return motion.getStyle(id)
  }

  function getOverlayStyle() {
    if (!snapshot.activeRect || !snapshot.dragging) {
      return { display: 'none' } as const
    }

    return {
      position: 'fixed',
      top: snapshot.activeRect.top,
      left: snapshot.activeRect.left,
      width: snapshot.activeRect.width,
      height: snapshot.activeRect.height,
      transform: `translate3d(${snapshot.dragOffset.x}px, ${snapshot.dragOffset.y}px, 0)`,
      opacity: 1,
      visibility: 'visible',
      backgroundColor: 'var(--card-background, var(--background, #fff))',
      color: 'var(--foreground, #111827)',
      boxShadow: '0 18px 40px rgb(15 23 42 / 18%), 0 2px 8px rgb(15 23 42 / 10%)',
      borderRadius: 'var(--radius-md, 8px)',
      outline: '1px solid var(--border, #e5e7eb)',
      overflow: 'hidden',
      isolation: 'isolate',
      contain: 'layout paint',
      pointerEvents: 'none',
      zIndex: 2147483647,
      willChange: 'transform',
    } as const
  }

  function scheduleMotion(nextItems: Record<string, SortableId[]>) {
    motion.measureFirst()
    previewItems = nextItems
    setSnapshot({ items: nextItems })
    requestAnimationFrame(() => {
      motion.measureLast(animation, notify)
      notify()
    })
  }

  function getNextItemsFromPointer(
    active: SortablePointerDrag,
    containerId: string,
    dragOffset: { x: number; y: number },
  ) {
    const from = findSortableLocation(previewItems, active.id)
    if (!from) {
      return previewItems
    }

    const containerItems = previewItems[containerId]
    if (!containerItems) {
      return previewItems
    }

    const activeRect = {
      left: active.activeRect.left + dragOffset.x,
      right: active.activeRect.left + active.activeRect.width + dragOffset.x,
      top: active.activeRect.top + dragOffset.y,
      bottom: active.activeRect.top + active.activeRect.height + dragOffset.y,
      width: active.activeRect.width,
      height: active.activeRect.height,
    }
    const crossedTarget = containerItems
      .filter((id) => id !== active.id)
      .map((id) => {
        const element = itemElements.get(getItemKey(id, containerId))
        const rect = element?.getBoundingClientRect()
        if (!rect) {
          return null
        }

        return {
          index: containerItems.indexOf(id),
          overlap: getMainAxisOverlap(activeRect, rect),
          threshold: Math.min(
            axis === 'x' ? activeRect.width : activeRect.height,
            axis === 'x' ? rect.width : rect.height,
          ) * 0.5,
        }
      })
      .filter((item): item is { index: number; overlap: number; threshold: number } => Boolean(item))
      .filter((item) => item.overlap > item.threshold)
      .sort((left, right) => right.overlap - left.overlap)[0]

    if (!crossedTarget) {
      return previewItems
    }

    const toIndex = crossedTarget.index > from.index ? crossedTarget.index + 1 : crossedTarget.index
    if (from.containerId === containerId && from.index === toIndex) {
      return previewItems
    }

    return moveSortableItem(previewItems, from, { containerId, index: toIndex })
  }

  function getContainerIdAtPoint(clientX: number, clientY: number) {
    let matchedContainerId: string | null = null
    let matchedArea = Number.POSITIVE_INFINITY

    for (const [containerId, element] of containerElements) {
      const rect = element.getBoundingClientRect()
      const inside =
        clientX >= rect.left &&
        clientX <= rect.left + rect.width &&
        clientY >= rect.top &&
        clientY <= rect.top + rect.height

      if (!inside) {
        continue
      }

      const area = rect.width * rect.height
      if (area < matchedArea) {
        matchedContainerId = containerId
        matchedArea = area
      }
    }

    return matchedContainerId
  }

  function getOverId(containerId: string, clientX: number, clientY: number) {
    for (const itemId of previewItems[containerId] ?? []) {
      const element = itemElements.get(getItemKey(itemId, containerId))
      const rect = element?.getBoundingClientRect()
      if (
        rect &&
        clientX >= rect.left &&
        clientX <= rect.left + rect.width &&
        clientY >= rect.top &&
        clientY <= rect.top + rect.height
      ) {
        return itemId
      }
    }

    return null
  }

  function getMainAxisOverlap(
    active: {
      left: number
      right: number
      top: number
      bottom: number
      width: number
      height: number
    },
    target: RectLike,
  ) {
    if (axis === 'x') {
      return Math.max(0, Math.min(active.right, target.left + target.width) - Math.max(active.left, target.left))
    }

    return Math.max(0, Math.min(active.bottom, target.top + target.height) - Math.max(active.top, target.top))
  }

  return {
    getSnapshot,
    subscribe,
    updateOptions,
    getPreviewItems,
    registerItem,
    registerContainer,
    registerMotionTarget,
    startPointerDrag,
    updatePointer,
    endPointerDrag,
    getItemStyle,
    getMotionStyle,
    getOverlayStyle,
  }
}

function toOverlayRect(rect: DOMRect): SortableOverlayRect {
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  }
}

function getItemKey(id: SortableId, containerId: string) {
  return `${containerId}:${id}`
}

export { DEFAULT_SORTABLE_CONTAINER_ID }
