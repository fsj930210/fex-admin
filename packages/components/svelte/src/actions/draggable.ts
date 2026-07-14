import {
  clearCurrentDndSource,
  DND_DRAG_START_X,
  DND_DRAG_START_Y,
  DND_DRAG_START_RECT_X,
  DND_DRAG_START_RECT_Y,
  DND_DRAG_START_RECT_WIDTH,
  DND_DRAG_START_RECT_HEIGHT,
  dropCurrentDndSource,
  moveCurrentDndSource,
  setCurrentDndSource,
} from '@fex/components-core/interactions/dnd-store'

export interface DraggableActionOptions<TData extends Record<string, unknown> = Record<string, unknown>> {
  id: string
  type?: string
  data?: TData
  disabled?: boolean
  handle?: HTMLElement | null
  onDraggingChange?: (dragging: boolean) => void
  onOverlayStyleChange?: (style: Partial<CSSStyleDeclaration>) => void
  dragPreview?: 'none' | 'clone'
}

export function draggableAction<TData extends Record<string, unknown> = Record<string, unknown>>(
  node: HTMLElement,
  options: DraggableActionOptions<TData>,
) {
  let currentOptions = options
  let cleanupWindow: (() => void) | undefined
  let previewElement: HTMLElement | null = null
  function clearPreview(){previewElement?.remove();previewElement=null}
  function mountPreview(rect:DOMRect){clearPreview();if(currentOptions.dragPreview!=='clone')return;const preview=node.cloneNode(true)as HTMLElement;preview.removeAttribute('id');for(const child of preview.querySelectorAll('[id]'))child.removeAttribute('id');preview.setAttribute('aria-hidden','true');preview.setAttribute('data-drag-preview','true');Object.assign(preview.style,{position:'fixed',top:`${rect.top}px`,left:`${rect.left}px`,width:'max-content',maxWidth:'none',height:`${rect.height}px`,marginInlineStart:'0',overflow:'visible',opacity:'0.45',pointerEvents:'none',zIndex:'20',willChange:'left, top'});document.body.append(preview);previewElement=preview}

  function source() {
    return { id: currentOptions.id, type: currentOptions.type, ...currentOptions.data }
  }

  function setDragging(dragging: boolean) {
    node.dataset.dragging = dragging ? 'true' : ''
    currentOptions.onDraggingChange?.(dragging)
  }

  function setOverlayStyle(rect: DOMRect | null, offset = { x: 0, y: 0 }) {
    if (!rect) {
      currentOptions.onOverlayStyleChange?.({ display: 'none' })
      return
    }
    currentOptions.onOverlayStyleChange?.({
      position: 'fixed',
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      pointerEvents: 'none',
      zIndex: '2147483647',
      opacity: '1',
      willChange: 'transform',
    })
  }

  function onPointerDown(event: PointerEvent) {
    if (currentOptions.disabled || event.button !== 0) {
      return
    }
    const handle = currentOptions.handle
    if (handle && event.target instanceof Node && !handle.contains(event.target)) {
      return
    }

    event.preventDefault()
    const start = { x: event.clientX, y: event.clientY }
    const rect = node.getBoundingClientRect()
    setCurrentDndSource({ ...source(), [DND_DRAG_START_X]: start.x, [DND_DRAG_START_Y]: start.y, [DND_DRAG_START_RECT_X]: rect.left, [DND_DRAG_START_RECT_Y]: rect.top, [DND_DRAG_START_RECT_WIDTH]: rect.width, [DND_DRAG_START_RECT_HEIGHT]: rect.height })
    moveCurrentDndSource(start)
    setDragging(true)
    setOverlayStyle(rect)
    mountPreview(rect)

    function onPointerMove(pointerEvent: PointerEvent) {
      const point = { x: pointerEvent.clientX, y: pointerEvent.clientY }
      moveCurrentDndSource(point)
      setOverlayStyle(rect, { x: point.x - start.x, y: point.y - start.y })
      if(previewElement){previewElement.style.left=`${rect.left+point.x-start.x}px`;previewElement.style.top=`${rect.top+point.y-start.y}px`}
    }

    function onPointerUp(pointerEvent: PointerEvent) {
      cleanupWindow?.()
      cleanupWindow = undefined
      dropCurrentDndSource({ x: pointerEvent.clientX, y: pointerEvent.clientY })
      setDragging(false)
      setOverlayStyle(null)
      clearPreview()
    }

    cleanupWindow = () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
  }

  node.addEventListener('pointerdown', onPointerDown)

  return {
    update(nextOptions: DraggableActionOptions<TData>) {
      currentOptions = nextOptions
    },
    destroy() {
      node.removeEventListener('pointerdown', onPointerDown)
      cleanupWindow?.()
      clearCurrentDndSource()
      clearPreview()
    },
  }
}
