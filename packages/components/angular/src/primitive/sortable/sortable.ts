import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core'
import type { OnChanges, OnDestroy, OnInit } from '@angular/core'
import { DEFAULT_SORTABLE_CONTAINER_ID, createSortableController } from '@fex/components-core/sortable/create-sortable-controller'
import { restoreSortableItems } from '@fex/components-core/sortable/containers'
import type { SortableAxis, SortableControllerSnapshot, SortableId, SortableItems, SortableMotionOptions } from '@fex/components-core/sortable/types'
import { ElementRef } from '@angular/core'

@Component({
  selector: 'fex-sortable',
  standalone: true,
  exportAs: 'fexSortable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
    '[attr.data-sortable-container]': 'containerId',
  },
  template: '<ng-content />',
})
export class FexSortable<TItems extends SortableItems = SortableItems> implements OnInit, OnChanges, OnDestroy {
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
  @Output() snapshotChange = new EventEmitter<SortableControllerSnapshot>()

  ngOnInit() {
    this.updateController()
    this.unsubscribe = this.controller.subscribe(() => {
      const snapshot = this.controller.getSnapshot()
      this.snapshot.set(snapshot)
      this.snapshotChange.emit(snapshot)
    })
    this.cleanup = this.controller.registerContainer(this.containerId, this.elementRef.nativeElement)
  }

  ngOnChanges() {
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

export {
  bindSortableItem,
  FexSortableContainerDirective,
  FexSortableItemDirective,
  FexSortableRegionDirective,
} from '../../directives/sortable'
