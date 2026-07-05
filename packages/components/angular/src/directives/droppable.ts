import { Directive, ElementRef, EventEmitter, Input, Output, inject } from '@angular/core'
import type { OnChanges, OnDestroy, OnInit } from '@angular/core'
import { registerDndDropTarget } from '@fex/components-core/interactions/dnd-store'
import type { DndDropArgs, DndSourceData } from '@fex/components-core/interactions/dnd-store'
import type { DropEdge } from '@fex/components-core/interactions/types'

@Directive({
  selector: '[fexDroppable]',
  standalone: true,
})
export class FexDroppableDirective implements OnInit, OnChanges, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
  private cleanup: (() => void) | undefined
  @Input({ required: true }) droppableId!: string
  @Input() accept?: string | string[]
  @Input() droppableData?: Record<string, unknown>
  @Input() disabled = false
  @Input() edges?: DropEdge[]
  @Input() canDrop?: (source: Record<string, unknown>) => boolean
  @Output() dragEntered = new EventEmitter<{ source: Record<string, unknown>; edge: DropEdge | null }>()
  @Output() dragLeft = new EventEmitter<void>()
  @Output() dropped = new EventEmitter<{ source: Record<string, unknown>; edge: DropEdge | null }>()

  ngOnInit() {
    this.bind()
  }

  ngOnChanges() {
    this.bind()
  }

  ngOnDestroy() {
    this.cleanup?.()
  }

  private bind() {
    const element = this.elementRef.nativeElement
    this.cleanup?.()
    element.dataset.droppableId = this.droppableId
    if (this.disabled || !this.droppableId) {
      return
    }

    const targetOptions = {
      id: this.droppableId,
      element,
      data: this.droppableData ?? {},
      canDrop: (source: DndSourceData) => this.acceptsSource(source),
      onDragEnter: ({ source, edge }: DndDropArgs) => {
        element.dataset.over = 'true'
        element.dataset.canDrop = 'true'
        element.dataset.dropEdge = edge ?? ''
        this.dragEntered.emit({ source, edge })
      },
      onDragLeave: () => {
        element.dataset.over = ''
        element.dataset.canDrop = ''
        element.dataset.dropEdge = ''
        this.dragLeft.emit()
      },
      onDrop: ({ source, edge }: DndDropArgs) => {
        element.dataset.over = ''
        element.dataset.canDrop = ''
        element.dataset.dropEdge = ''
        this.dropped.emit({ source, edge })
      },
    }
    this.cleanup = registerDndDropTarget(this.edges ? { ...targetOptions, edges: this.edges } : targetOptions)
  }

  private acceptsSource(source: Record<string, unknown>) {
    const acceptList = this.accept === undefined ? [] : Array.isArray(this.accept) ? this.accept : [this.accept]
    const accepted = acceptList.length === 0 || acceptList.includes(String(source.type))
    return accepted && (this.canDrop?.(source) ?? true)
  }
}
