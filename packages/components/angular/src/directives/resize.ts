import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core'
import { createResizeController } from '@fex/components-core/interactions/create-resize-controller'
import { defaultRect, rectToStyle } from '@fex/components-core/interactions/rect'
import type { Rect, ResizeEdge, ResizeEdges } from '@fex/components-core/interactions/types'

@Directive({
  selector: '[fexResize]',
  standalone: true,
})
export class FexResizeDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
  private cleanupWindow?: () => void
  private unsubscribe?: () => void
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
    this.unsubscribe = this.controller.subscribe(() => {
      const style = rectToStyle(this.controller.getSnapshot().rect)
      element.style.transform = style.transform
      element.style.width = style.width
      element.style.height = style.height
      element.style.boxSizing = 'border-box'
    })
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
      edges: this.edges,
      minWidth: this.minWidth,
      maxWidth: this.maxWidth,
      minHeight: this.minHeight,
      maxHeight: this.maxHeight,
      bounds: this.bounds,
      onResize: (rect) => this.resize.emit(rect),
      onResizeEnd: (rect) => this.resizeEnd.emit(rect),
    })
  }

  private readonly onPointerDown = (event: PointerEvent) => {
    this.updateController()
    if (this.disabled || !this.controller.start(toInput(event), this.edge)) {
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

function toInput(event: PointerEvent) {
  return {
    button: event.button,
    pointerId: event.pointerId,
    clientX: event.clientX,
    clientY: event.clientY,
    preventDefault: () => event.preventDefault(),
  }
}
