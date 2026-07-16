import { Directive, ElementRef, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core'
import type { OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { DEFAULT_SORTABLE_CONTAINER_ID, createSortableController } from '@fex/components-core/sortable/create-sortable-controller'
import type { SortablePointerInput, SortablePointerMoveInput } from '@fex/components-core/sortable/create-sortable-controller'
import { restoreSortableItems } from '@fex/components-core/sortable/containers'
import type { SortableAxis, SortableId, SortableItems, SortableMotionOptions } from '@fex/components-core/sortable/types'

export interface FexSortableHost {
  controller: {
    registerItem(id: SortableId, containerId: string, element: HTMLElement): () => void
    registerContainer(containerId: string, element: HTMLElement): () => void
    subscribe(listener: () => void): () => void
    getItemStyle(id: SortableId): unknown
    startPointerDrag(input: SortablePointerInput, id: SortableId, containerId: string): boolean
    updatePointer(input: SortablePointerMoveInput): void
    endPointerDrag(): void
  }
  getOverlayStyle(): Record<string, string | number | undefined>
  getMotionStyle(id: SortableId): Record<string, string | number | undefined>
  registerMotionTarget(id: SortableId, element: HTMLElement | null): void | (() => void)
}

@Directive({
  selector: '[fexSortableContainer]',
  standalone: true,
  exportAs: 'fexSortableContainer',
})
export class FexSortableContainerDirective<TItems extends SortableItems = SortableItems> implements OnInit, OnChanges, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
  private cleanup: (() => void) | undefined
  private unsubscribe: (() => void) | undefined
  readonly controller = createSortableController<TItems>({ items: [] as unknown as TItems })
  readonly snapshot = signal(this.controller.getSnapshot())
  readonly activeId = computed(() => this.snapshot().activeId)
  readonly previewItems = computed(() => restoreSortableItems(this.items, this.snapshot().items))

  @Input({ required: true }) items!: TItems
  @Input() containerId = DEFAULT_SORTABLE_CONTAINER_ID
  @Input() axis?: SortableAxis
  @Input() animation?: SortableMotionOptions
  @Output() itemsChange = new EventEmitter<TItems>()

  ngOnInit() {
    this.updateController()
    this.unsubscribe = this.controller.subscribe(() => this.snapshot.set(this.controller.getSnapshot()))
    this.cleanup = this.controller.registerContainer(this.containerId, this.elementRef.nativeElement)
  }

  ngOnChanges(_changes: SimpleChanges) {
    this.updateController()
  }

  ngOnDestroy() {
    this.cleanup?.()
    this.unsubscribe?.()
  }

  getOverlayStyle() {
    this.snapshot()
    return this.controller.getOverlayStyle() as Record<string, string | number | undefined>
  }

  getMotionStyle(id: SortableId) {
    this.snapshot()
    return this.controller.getMotionStyle(id) as Record<string, string | number | undefined>
  }

  registerMotionTarget(id: SortableId, element: HTMLElement | null) {
    return this.controller.registerMotionTarget(id, element)
  }

  private updateController() {
    if (!this.items) {
      return
    }
    this.controller.updateOptions({
      items: this.items,
      onChange: (items) => this.itemsChange.emit(items),
      ...(this.axis ? { axis: this.axis } : {}),
      ...(this.animation ? { animation: this.animation } : {}),
    })
    this.snapshot.set(this.controller.getSnapshot())
  }
}

@Directive({
  selector: '[fexSortableRegion]',
  standalone: true,
})
export class FexSortableRegionDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
  private cleanup?: () => void
  @Input({ required: true }) sortable!: FexSortableHost
  @Input({ required: true }) containerId!: string

  ngOnInit() {
    this.cleanup = this.sortable.controller.registerContainer(this.containerId, this.elementRef.nativeElement)
  }

  ngOnDestroy() {
    this.cleanup?.()
  }
}

@Directive({
  selector: '[fexSortableItem]',
  standalone: true,
})
export class FexSortableItemDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
  private cleanup?: () => void
  @Input({ required: true }) sortable!: FexSortableHost
  @Input({ required: true }) sortableId!: SortableId
  @Input() containerId = DEFAULT_SORTABLE_CONTAINER_ID
  @Input() disabled = false

  ngOnInit() {
    this.cleanup = bindSortableItem(this.sortable, this.elementRef.nativeElement, this.sortableId, this.containerId, () => this.disabled)
  }

  ngOnDestroy() {
    this.cleanup?.()
  }
}

export function bindSortableItem(
  sortable: FexSortableHost,
  element: HTMLElement,
  sortableId: SortableId,
  containerId = DEFAULT_SORTABLE_CONTAINER_ID,
  disabled: () => boolean = () => false,
) {
  const cleanupItem = sortable.controller.registerItem(sortableId, containerId, element)
  const previousTouchAction = element.style.touchAction
  // The controller owns pointer movement once a drag begins. Making this an
  // inline contract avoids relying on a Tailwind utility being discovered in
  // every consumer app and prevents browser panning from stealing the gesture.
  element.style.touchAction = 'none'
  const applyStyle = () => {
    const style = sortable.controller.getItemStyle(sortableId) as Record<string, string | number | undefined>
    for (const property of ['width', 'height', 'minWidth', 'minHeight', 'boxSizing', 'flexShrink', 'visibility', 'transition', 'transform'] as const) {
      const value = style[property]
      element.style[property] = value === undefined ? '' : String(value)
    }
  }
  const unsubscribe = sortable.controller.subscribe(applyStyle)
  let cleanupPointerSession: (() => void) | undefined
  let draggingThisItem = false
  const onPointerDown = (event: PointerEvent) => {
    if (disabled() || !sortable.controller.startPointerDrag(toInput(event), sortableId, containerId)) return
    draggingThisItem = true
    element.setPointerCapture?.(event.pointerId)
    const onPointerMove = (pointerEvent: PointerEvent) => sortable.controller.updatePointer({
      clientX: pointerEvent.clientX,
      clientY: pointerEvent.clientY,
      preventDefault: () => pointerEvent.preventDefault(),
    })
    const onPointerUp = () => {
      cleanupPointerSession?.()
      if (element.hasPointerCapture?.(event.pointerId)) {
        element.releasePointerCapture(event.pointerId)
      }
      sortable.controller.endPointerDrag()
      draggingThisItem = false
    }
    cleanupPointerSession?.()
    cleanupPointerSession = () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      cleanupPointerSession = undefined
    }
    // Keep the session on window as a fallback for browser drivers and for a
    // pointer released outside the source. The active node is stable during
    // preview; the table order is committed only after this handler finishes.
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp, { once: true })
    window.addEventListener('pointercancel', onPointerUp, { once: true })
  }
  element.addEventListener('pointerdown', onPointerDown)
  applyStyle()
  return () => {
    // A preview reorder can legitimately replace this Angular view before the
    // pointer is released. The session lives on window, not on that view, so
    // keep it alive until pointerup can commit the controller transaction.
    if (!draggingThisItem) {
      cleanupPointerSession?.()
    }
    element.removeEventListener('pointerdown', onPointerDown)
    element.style.touchAction = previousTouchAction
    cleanupItem()
    unsubscribe()
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
