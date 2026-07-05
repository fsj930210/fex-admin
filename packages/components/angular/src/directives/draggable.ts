import { Directive, ElementRef, EventEmitter, Input, Output, inject } from '@angular/core'
import type { OnDestroy, OnInit } from '@angular/core'
import {
  clearCurrentDndSource,
  dropCurrentDndSource,
  moveCurrentDndSource,
  setCurrentDndSource,
} from '@fex/components-core/interactions/dnd-store'

@Directive({
  selector: '[fexDraggable]',
  standalone: true,
})
export class FexDraggableDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
  private cleanupWindow: (() => void) | undefined
  @Input({ required: true }) draggableId!: string
  @Input() draggableType?: string
  @Input() draggableData?: Record<string, unknown>
  @Input() disabled = false
  @Output() draggingChange = new EventEmitter<boolean>()
  @Output() overlayStyleChange = new EventEmitter<Record<string, string | number>>()

  ngOnInit() {
    this.elementRef.nativeElement.addEventListener('pointerdown', this.onPointerDown)
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.removeEventListener('pointerdown', this.onPointerDown)
    this.cleanupWindow?.()
    clearCurrentDndSource()
  }

  private readonly onPointerDown = (event: PointerEvent) => {
    if (this.disabled || event.button !== 0) {
      return
    }

    event.preventDefault()
    const start = { x: event.clientX, y: event.clientY }
    const rect = this.elementRef.nativeElement.getBoundingClientRect()
    setCurrentDndSource({ id: this.draggableId, type: this.draggableType, ...this.draggableData })
    moveCurrentDndSource(start)
    this.draggingChange.emit(true)
    this.emitOverlayStyle(rect)

    const onPointerMove = (pointerEvent: PointerEvent) => {
      const point = { x: pointerEvent.clientX, y: pointerEvent.clientY }
      moveCurrentDndSource(point)
      this.emitOverlayStyle(rect, { x: point.x - start.x, y: point.y - start.y })
    }
    const onPointerUp = (pointerEvent: PointerEvent) => {
      this.cleanupWindow?.()
      this.cleanupWindow = undefined
      dropCurrentDndSource({ x: pointerEvent.clientX, y: pointerEvent.clientY })
      this.draggingChange.emit(false)
      this.overlayStyleChange.emit({ display: 'none' })
    }
    this.cleanupWindow = () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
  }

  private emitOverlayStyle(rect: DOMRect, offset = { x: 0, y: 0 }) {
    this.overlayStyleChange.emit({
      position: 'fixed',
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      pointerEvents: 'none',
      zIndex: 2147483647,
      opacity: 1,
      willChange: 'transform',
    })
  }
}
