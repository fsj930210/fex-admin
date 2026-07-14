import { Directive, ElementRef, HostListener, inject } from '@angular/core'
import type { OnDestroy, OnInit } from '@angular/core'
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
  registerDndDropTarget,
  setCurrentDndSource,
} from '@fex/components-core/interactions/dnd-store'
import type {
  DndFeatureApi,
  TreeDropIntent,
} from '@fex/components-core/tree/features/dnd'
import type { TreeKey } from '@fex/components-core/tree/types'
import { TreeItemDirective } from './tree'

@Directive({
  selector: '[fexTreeDndItem]',
  standalone: true,
})
export class TreeDndItemDirective implements OnInit, OnDestroy {
  private readonly item = inject(TreeItemDirective)
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private cleanupDrop: (() => void) | undefined
  private cleanupWindow: (() => void) | undefined
  private preview: HTMLElement | null = null
  private intent: TreeDropIntent | null = null

  ngOnInit() {
    const tree = this.item.root.tree()
    const key = this.item.key()
    const feature = tree.getFeature<DndFeatureApi>('dnd')
    const disabled = this.item.item()?.disabled === true || !feature || feature.canDrag(key) !== true

    this.element.dataset.dndEnabled = disabled ? '' : 'true'
    this.cleanupDrop = registerDndDropTarget({
      id: `tree:${String(key)}`,
      element: this.element,
      data: { treeKey: key },
      canDrop: (source) => {
        const sourceKey = getKey(source.treeKey)
        return sourceKey !== undefined && sourceKey !== key && !tree.getPath(key).includes(sourceKey)
      },
      getPosition: ({ element, pointer, source }) => {
        const value = this.resolve(source, pointer, getRect(element))
        if (!value?.valid) return null
        if (value.position === 'after') return 'bottom'
        return 'inside'
      },
      onDragEnter: (args) =>
        this.updateIntent(this.resolve(args.source, args.pointer, args.targetRect)),
      onDrag: (args) =>
        this.updateIntent(this.resolve(args.source, args.pointer, args.targetRect)),
      onDragLeave: () => this.updateIntent(null),
      onDrop: (args) => {
        const value = this.resolve(args.source, args.pointer, args.targetRect)
        this.updateIntent(null)
        if (value?.valid) feature?.drop(value)
      },
    })
  }

  ngOnDestroy() {
    this.cleanupDrop?.()
    this.cleanupWindow?.()
    this.clearPreview()
    clearCurrentDndSource()
  }

  @HostListener('pointerdown', ['$event'])
  start(event: PointerEvent) {
    const feature = this.item.root.tree().getFeature<DndFeatureApi>('dnd')
    if (event.button !== 0 || feature?.canDrag(this.item.key()) !== true) return

    event.preventDefault()
    const start = { x: event.clientX, y: event.clientY }
    const bounds = this.element.getBoundingClientRect()

    setCurrentDndSource({
      id: `tree:${String(this.item.key())}`,
      type: 'tree-item',
      treeKey: this.item.key(),
      [DND_DRAG_START_X]: start.x,
      [DND_DRAG_START_Y]: start.y,
      [DND_DRAG_START_RECT_X]: bounds.left,
      [DND_DRAG_START_RECT_Y]: bounds.top,
      [DND_DRAG_START_RECT_WIDTH]: bounds.width,
      [DND_DRAG_START_RECT_HEIGHT]: bounds.height,
    })
    moveCurrentDndSource(start)
    this.element.dataset.dragging = 'true'
    this.mountPreview(bounds)

    const move = (pointer: PointerEvent) => {
      const point = { x: pointer.clientX, y: pointer.clientY }
      moveCurrentDndSource(point)
      if (this.preview) {
        this.preview.style.left = `${bounds.left + point.x - start.x}px`
        this.preview.style.top = `${bounds.top + point.y - start.y}px`
      }
    }
    const end = (pointer: PointerEvent) => {
      this.cleanupWindow?.()
      this.cleanupWindow = undefined
      dropCurrentDndSource({ x: pointer.clientX, y: pointer.clientY })
      this.element.dataset.dragging = ''
      this.clearPreview()
    }

    this.cleanupWindow = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', end)
      window.removeEventListener('pointercancel', end)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', end)
    window.addEventListener('pointercancel', end)
  }

  private resolve(
    source: Record<string, unknown>,
    pointer: { x: number; y: number },
    targetRect: { x: number; y: number; width: number; height: number },
  ) {
    const sourceKey = getKey(source.treeKey)
    if (sourceKey === undefined) return undefined

    return this.item.root.tree().getFeature<DndFeatureApi>('dnd')?.resolve({
      sourceKey,
      targetKey: this.item.key(),
      pointer,
      dragRect: getDragRect(source, pointer),
      targetRect,
      indent: this.item.root.indent(),
    })
  }

  private updateIntent(value: TreeDropIntent | null | undefined) {
    this.intent = value?.valid ? value : null
    this.element.dataset.dropPosition = this.intent
      ? this.intent.position === 'after'
          ? 'bottom'
          : 'inside'
      : ''
    this.element.style.setProperty(
      '--tree-drop-inline-start',
      this.intent
        ? `${getTreeTitleOffset(this.element) + this.intent.indicatorOffset}px`
        : '',
    )
    this.element.style.setProperty(
      '--tree-drop-inline-width',
      this.intent
        ? `${getDropIndicatorWidth(this.element, this.intent.indicatorOffset)}px`
        : '',
    )
  }

  private mountPreview(bounds: DOMRect) {
    this.clearPreview()
    const preview = this.element.cloneNode(true) as HTMLElement
    preview.removeAttribute('id')
    for (const child of preview.querySelectorAll('[id]')) child.removeAttribute('id')
    preview.setAttribute('aria-hidden', 'true')
    preview.setAttribute('data-drag-preview', 'true')
    Object.assign(preview.style, {
      position: 'fixed',
      top: `${bounds.top}px`,
      left: `${bounds.left}px`,
      width: 'max-content',
      maxWidth: 'none',
      height: `${bounds.height}px`,
      marginInlineStart: '0',
      overflow: 'visible',
      opacity: '0.45',
      pointerEvents: 'none',
      zIndex: '20',
      willChange: 'left, top',
    })
    document.body.append(preview)
    this.preview = preview
  }

  private clearPreview() {
    this.preview?.remove()
    this.preview = null
  }
}

function getKey(value: unknown): TreeKey | undefined {
  return typeof value === 'string' || typeof value === 'number' ? value : undefined
}

function getDragRect(source: Record<string, unknown>, pointer: { x: number; y: number }) {
  const startX = source[DND_DRAG_START_X]; const startY = source[DND_DRAG_START_Y]
  const x = source[DND_DRAG_START_RECT_X]; const y = source[DND_DRAG_START_RECT_Y]
  const width = source[DND_DRAG_START_RECT_WIDTH]; const height = source[DND_DRAG_START_RECT_HEIGHT]
  if (typeof startX !== 'number' || typeof startY !== 'number' || typeof x !== 'number' || typeof y !== 'number' || typeof width !== 'number' || typeof height !== 'number') return undefined
  return { x: x + pointer.x - startX, y: y + pointer.y - startY, width, height }
}

function getRect(element: HTMLElement) {
  const value = element.getBoundingClientRect()
  return {
    x: value.left,
    y: value.top,
    width: value.width,
    height: value.height,
  }
}

function getTreeTitleOffset(element: HTMLElement) {
  const title = element.querySelector<HTMLElement>('[data-slot="tree-title"]')
  return title ? title.getBoundingClientRect().left - element.getBoundingClientRect().left : 0
}

function getDropIndicatorWidth(element: HTMLElement, indicatorOffset: number) {
  const itemRect = element.getBoundingClientRect()
  const treeRect = element.closest<HTMLElement>('[data-slot="tree"]')?.getBoundingClientRect()
  return Math.max(0, (treeRect?.right ?? itemRect.right) - itemRect.left - getTreeTitleOffset(element) - indicatorOffset)
}
