import { DEFAULT_SORTABLE_CONTAINER_ID, createSortableController } from '@fex/components-core/sortable/create-sortable-controller'
import { restoreSortableItems } from '@fex/components-core/sortable/containers'
import type { SortableAxis, SortableId, SortableItems, SortableMotionOptions } from '@fex/components-core/sortable/types'
import { createMemo, createSignal, onCleanup } from 'solid-js'
import type { JSX } from 'solid-js'

export interface CreateSortableOptions<TItems extends SortableItems> {
  items: TItems
  axis?: SortableAxis
  disabled?: boolean
  animation?: SortableMotionOptions
  onChange?: (items: TItems) => void
}

export function createSortable<TItems extends SortableItems>(options: CreateSortableOptions<TItems>) {
  let currentOptions = options
  const controller = createSortableController(options)
  const [snapshot, setSnapshot] = createSignal(controller.getSnapshot())
  const cleanups = new Set<() => void>()
  const unsubscribe = controller.subscribe(() => setSnapshot(controller.getSnapshot()))

  function update(next: CreateSortableOptions<TItems>) {
    currentOptions = next
    controller.updateOptions(next)
    setSnapshot(controller.getSnapshot())
  }

  function setContainer(containerId = DEFAULT_SORTABLE_CONTAINER_ID) {
    return (element: HTMLElement | null) => {
      if (element) {
        cleanups.add(controller.registerContainer(containerId, element))
      }
    }
  }

  function setItem(id: SortableId, containerId = DEFAULT_SORTABLE_CONTAINER_ID) {
    return (element: HTMLElement | null) => {
      if (element) {
        cleanups.add(controller.registerItem(id, containerId, element))
      }
    }
  }

  function onPointerDown(event: PointerEvent, id: SortableId, containerId = DEFAULT_SORTABLE_CONTAINER_ID) {
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

  onCleanup(() => {
    unsubscribe()
    for (const cleanup of cleanups) {
      cleanup()
    }
  })

  return {
    snapshot,
    previewItems: createMemo(() => restoreSortableItems(currentOptions.items, snapshot().items)),
    update,
    setContainer,
    setItem,
    onPointerDown,
    getItemStyle: (id: SortableId) => {
      snapshot()
      return toSolidStyle(controller.getItemStyle(id))
    },
    getMotionStyle: (id: SortableId) => {
      snapshot()
      return toSolidStyle(controller.getMotionStyle(id))
    },
    getOverlayStyle: () => {
      snapshot()
      return toSolidStyle(controller.getOverlayStyle())
    },
    registerMotionTarget: (id: SortableId, element: HTMLElement | null) => controller.registerMotionTarget(id, element),
  }
}

function toSolidStyle(style: object): JSX.CSSProperties {
  const solidStyle: Record<string, string | number> = {}

  for (const [key, value] of Object.entries(style) as Array<[string, string | number | undefined]>) {
    if (value === undefined) {
      continue
    }

    solidStyle[key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)] = value
  }

  return solidStyle as JSX.CSSProperties
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
