import { Directive, ElementRef, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core'
import type { OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { DEFAULT_SORTABLE_CONTAINER_ID, createSortableController } from '@fex/components-core/sortable/create-sortable-controller'
import { restoreSortableItems } from '@fex/components-core/sortable/containers'
import type { SortableAxis, SortableId, SortableItems, SortableMotionOptions } from '@fex/components-core/sortable/types'

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
  @Input({ required: true }) sortable!: FexSortableContainerDirective<any>
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
  private unsubscribe?: () => void
  @Input({ required: true }) sortable!: FexSortableContainerDirective<any>
  @Input({ required: true }) sortableId!: SortableId
  @Input() containerId = DEFAULT_SORTABLE_CONTAINER_ID
  @Input() disabled = false

  ngOnInit() {
    this.cleanup = this.sortable.controller.registerItem(this.sortableId, this.containerId, this.elementRef.nativeElement)
    this.unsubscribe = this.sortable.controller.subscribe(() => this.applyStyle())
    this.elementRef.nativeElement.addEventListener('pointerdown', this.onPointerDown)
    this.applyStyle()
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.removeEventListener('pointerdown', this.onPointerDown)
    this.cleanup?.()
    this.unsubscribe?.()
  }

  private applyStyle() {
    const style = this.sortable.controller.getItemStyle(this.sortableId) as Record<string, string | number | undefined>
    const element = this.elementRef.nativeElement
    for (const property of ['width', 'height', 'minWidth', 'minHeight', 'boxSizing', 'flexShrink', 'visibility', 'transition', 'transform'] as const) {
      const value = style[property]
      element.style[property] = value === undefined ? '' : String(value)
    }
  }

  private readonly onPointerDown = (event: PointerEvent) => {
    if (this.disabled || !this.sortable.controller.startPointerDrag(toInput(event), this.sortableId, this.containerId)) {
      return
    }

    const onPointerMove = (pointerEvent: PointerEvent) => {
      this.sortable.controller.updatePointer({
        clientX: pointerEvent.clientX,
        clientY: pointerEvent.clientY,
        preventDefault: () => pointerEvent.preventDefault(),
      })
    }
    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      this.sortable.controller.endPointerDrag()
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp, { once: true })
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
