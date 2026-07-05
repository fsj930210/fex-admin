import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, inject } from '@angular/core'
import type { OnDestroy, OnInit } from '@angular/core'
import { createResizeController } from '@fex/components-core/interactions/create-resize-controller'
import { defaultRect, rectToStyle } from '@fex/components-core/interactions/rect'
import type { Rect, ResizeEdge, ResizeEdges } from '@fex/components-core/interactions/types'

@Directive({
  selector: '[fexResize]',
  standalone: true,
})
export class FexResizeDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
  private cleanupWindow: (() => void) | undefined
  private unsubscribe: (() => void) | undefined
  private controller = createResizeController({
    rect: defaultRect,
    onResize: (rect) => this.resize.emit(rect),
    onResizeEnd: (rect) => this.resizeEnd.emit(rect),
  })

  @Input() rect: Rect = defaultRect
  @Input() edge: ResizeEdge = 'bottom-right'
  @Input() edges?: ResizeEdges
  @Input() minWidth?: number
  @Input() maxWidth?: number
  @Input() minHeight?: number
  @Input() maxHeight?: number
  @Input() bounds?: 'viewport' | 'parent' | HTMLElement | false
  @Input() disabled = false
  @Output() resize = new EventEmitter<Rect>()
  @Output() resizeEnd = new EventEmitter<Rect>()

  ngOnInit() {
    const element = this.elementRef.nativeElement
    this.controller.setTarget(element)
    this.updateController()
    this.applySnapshot()
    this.unsubscribe = this.controller.subscribe(() => this.applySnapshot())
    element.addEventListener('pointerdown', this.onPointerDown)
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.removeEventListener('pointerdown', this.onPointerDown)
    this.cleanupWindow?.()
    this.unsubscribe?.()
    this.controller.cancel()
  }

  private updateController() {
    this.controller.updateOptions({
      rect: this.rect,
      onResize: (rect) => this.resize.emit(rect),
      onResizeEnd: (rect) => this.resizeEnd.emit(rect),
      ...(this.edges === undefined ? {} : { edges: this.edges }),
      ...(this.minWidth === undefined ? {} : { minWidth: this.minWidth }),
      ...(this.maxWidth === undefined ? {} : { maxWidth: this.maxWidth }),
      ...(this.minHeight === undefined ? {} : { minHeight: this.minHeight }),
      ...(this.maxHeight === undefined ? {} : { maxHeight: this.maxHeight }),
      ...(this.bounds === undefined ? {} : { bounds: this.bounds }),
    })
  }

  private applySnapshot() {
    const style = rectToStyle(this.controller.getSnapshot().rect)
    const element = this.elementRef.nativeElement
    element.style.transform = style.transform
    element.style.width = style.width
    element.style.height = style.height
    element.style.boxSizing = 'border-box'
  }

  private readonly onPointerDown = (event: PointerEvent) => {
    this.updateController()
    const edge = getResizeEdge(event.target, this.elementRef.nativeElement) ?? this.edge
    if (this.disabled || !this.controller.start(toInput(event), edge)) {
      return
    }

    window.addEventListener('pointermove', this.onPointerMove, { passive: false })
    window.addEventListener('pointerup', this.onPointerUp)
    window.addEventListener('pointercancel', this.onPointerUp)
    this.cleanupWindow = () => {
      window.removeEventListener('pointermove', this.onPointerMove)
      window.removeEventListener('pointerup', this.onPointerUp)
      window.removeEventListener('pointercancel', this.onPointerUp)
    }
  }

  private readonly onPointerMove = (event: PointerEvent) => {
    this.controller.move(toInput(event))
  }

  private readonly onPointerUp = (event: PointerEvent) => {
    this.cleanupWindow?.()
    this.cleanupWindow = undefined
    this.controller.end({ pointerId: event.pointerId })
  }
}

@Directive({
  selector: '[fexResizeHandle]',
  standalone: true,
})
export class FexResizeHandleDirective {
  @Input({ alias: 'fexResizeHandle', required: true }) edge!: ResizeEdge

  @HostBinding('attr.data-resize-edge')
  protected get dataResizeEdge() {
    return this.edge
  }

  @HostListener('pointerdown', ['$event'])
  protected onPointerDown(event: PointerEvent) {
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.dataset.resizeEdge = this.edge
    }
  }
}

function toInput(event: PointerEvent) {
  return {
    button: event.button,
    pointerId: event.pointerId,
    clientX: event.clientX,
    clientY: event.clientY,
    preventDefault: () => event.preventDefault(),
  }
}

function getResizeEdge(target: EventTarget | null, boundary: HTMLElement) {
  let current = target instanceof HTMLElement ? target : null
  while (current && current !== boundary) {
    const edge = current.dataset.resizeEdge
    if (edge) {
      return edge as ResizeEdge
    }
    current = current.parentElement
  }

  return null
}
