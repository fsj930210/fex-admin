import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core'
import { createMoveController } from '@fex/components-core/interactions/create-move-controller'
import type { InteractionAxis, Point } from '@fex/components-core/interactions/types'

@Directive({
  selector: '[fexMove]',
  standalone: true,
})
export class FexMoveDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
  private cleanupWindow?: () => void
  private unsubscribe?: () => void
  private controller = createMoveController({
    position: { x: 0, y: 0 },
    onMove: (position) => this.move.emit(position),
    onMoveEnd: (position) => this.moveEnd.emit(position),
  })

  @Input() position: Point = { x: 0, y: 0 }
  @Input() axis?: InteractionAxis
  @Input() bounds?: 'viewport' | 'parent' | HTMLElement | false
  @Input() disabled = false
  @Output() move = new EventEmitter<Point>()
  @Output() moveEnd = new EventEmitter<Point>()

  ngOnInit() {
    const element = this.elementRef.nativeElement
    this.controller.setTarget(element)
    this.controller.updateOptions({
      position: this.position,
      axis: this.axis,
      bounds: this.bounds,
      onMove: (position) => this.move.emit(position),
      onMoveEnd: (position) => this.moveEnd.emit(position),
    })
    this.unsubscribe = this.controller.subscribe(() => {
      const snapshot = this.controller.getSnapshot()
      element.style.transform = `translate3d(${snapshot.position.x}px, ${snapshot.position.y}px, 0)`
      element.style.willChange = snapshot.moving ? 'transform' : ''
    })
    element.addEventListener('pointerdown', this.onPointerDown)
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.removeEventListener('pointerdown', this.onPointerDown)
    this.cleanupWindow?.()
    this.unsubscribe?.()
    this.controller.cancel()
  }

  private readonly onPointerDown = (event: PointerEvent) => {
    if (this.disabled || !this.controller.start(toInput(event))) {
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
