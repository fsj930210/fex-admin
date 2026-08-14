import { NgTemplateOutlet } from '@angular/common'
import { ChangeDetectionStrategy, Component, computed, contentChild, DestroyRef, Directive, effect, ElementRef, inject, input, output, TemplateRef, viewChild, viewChildren } from '@angular/core'
import { createMasonryController } from '@fex-design/core/masonry/create-masonry-controller'
import { resolveMasonryColumns, resolveMasonryGap } from '@fex-design/core/masonry/layout'
import type { MasonryColumns, MasonryGap, MasonryItemPosition, MasonryKey, MasonryLayoutDetail, MasonryPlacement } from '@fex-design/core/masonry/types'
import { masonryItemClassName, masonryRootClassName, masonryViewportClassName } from '@fex-design/styles/masonry'
import { injectVirtualizer } from '@tanstack/angular-virtual'
import { createHostClassName } from '../../signals/host-class'
import { createCoreStoreSignal } from '../../signals/core-store-signal'

@Component({ selector: 'fex-masonry', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { '[class]': 'hostClassName()', '[attr.dir]': 'direction()', 'data-slot': 'masonry' }, template: '<ng-content />' })
export class MasonryRoot {
  readonly columns = input<MasonryColumns | undefined>(); readonly gap = input<number | Partial<MasonryGap> | undefined>(); readonly placement = input<MasonryPlacement | undefined>(); readonly direction = input<'ltr' | 'rtl'>('ltr'); readonly layoutChange = output<MasonryLayoutDetail>()
  readonly controller = createMasonryController(); readonly snapshot = createCoreStoreSignal(this.controller)
  protected readonly hostClassName = createHostClassName(masonryRootClassName)
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef); private readonly destroyRef = inject(DestroyRef)
  constructor() {
    effect(() => this.controller.setOptions({ columns: this.columns(), gap: this.gap(), placement: this.placement(), direction: this.direction(), onLayoutChange: detail => this.layoutChange.emit(detail) }))
    const observer = new ResizeObserver(([entry]) => this.controller.setWidth(entry?.contentRect.width ?? 0)); observer.observe(this.element.nativeElement)
    this.destroyRef.onDestroy(() => { observer.disconnect(); this.controller.destroy() })
  }
}

@Component({ selector: 'fex-masonry-viewport', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { '[class]': 'hostClassName()', 'data-slot': 'masonry-viewport', '[style.height.px]': 'root.snapshot().height' }, template: '<ng-content />' })
export class MasonryViewport { readonly root = inject(MasonryRoot); protected readonly hostClassName = createHostClassName(masonryViewportClassName) }

@Directive({ selector: '[fexMasonryItem]', standalone: true, host: { '[class]': 'hostClassName()', 'data-slot': 'masonry-item', '[attr.data-column]': 'position()?.column ?? null', '[style.visibility]': "position() ? null : 'hidden'", '[style.--masonry-inline-start]': "(position()?.inlineStart ?? 0) + 'px'", '[style.--masonry-top]': "(position()?.top ?? 0) + 'px'", '[style.--masonry-item-width]': "(position()?.width ?? root.snapshot().columnWidth) + 'px'" } })
export class MasonryItem {
  readonly itemKey = input.required<MasonryKey>({ alias: 'fexMasonryItem' }); readonly index = input.required<number>(); readonly column = input<number | undefined>()
  readonly root = inject(MasonryRoot); readonly position = computed<MasonryItemPosition | undefined>(() => this.root.snapshot().items.find(item => item.key === this.itemKey()))
  protected readonly hostClassName = createHostClassName(masonryItemClassName)
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef); private readonly destroyRef = inject(DestroyRef)
  constructor() {
    const observer = new ResizeObserver(([entry]) => this.commit(entry?.borderBoxSize[0]?.blockSize ?? entry?.contentRect.height ?? 0)); observer.observe(this.element.nativeElement)
    effect(() => { this.index(); this.column(); this.commit(this.element.nativeElement.getBoundingClientRect().height) })
    this.destroyRef.onDestroy(() => { observer.disconnect(); this.root.controller.removeItem(this.itemKey()) })
  }
  private commit(height: number) { this.root.controller.setItem({ key: this.itemKey(), index: this.index(), column: this.column(), height }) }
}

@Component({ selector: 'fex-masonry-virtual-viewport', standalone: true, imports: [NgTemplateOutlet], changeDetection: ChangeDetectionStrategy.OnPush, host: { class: 'block', 'data-slot': 'masonry-virtual-viewport' }, templateUrl: './masonry-virtual-viewport.html' })
export class MasonryVirtualViewport<T = unknown> {
  readonly root = inject(MasonryRoot); readonly items = input.required<readonly T[]>(); readonly getItemKey = input.required<(item: T, index: number) => MasonryKey>(); readonly estimateSize = input.required<(item: T, index: number) => number>(); readonly height = input.required<number>(); readonly overscan = input(4)
  readonly template = contentChild.required<TemplateRef<{ $implicit: T; index: number }>>(TemplateRef); readonly scrollElement = viewChild<ElementRef<HTMLDivElement>>('scrollElement')
  readonly itemElements = viewChildren<ElementRef<HTMLDivElement>>('itemElement')
  readonly gap = computed(() => resolveMasonryGap(this.root.gap())); readonly columnCount = computed(() => resolveMasonryColumns(this.root.columns(), this.root.snapshot().width, this.gap().column)); readonly columnWidth = computed(() => Math.max(0, (this.root.snapshot().width - this.gap().column * (this.columnCount() - 1)) / this.columnCount()))
  readonly directionSign = computed(() => this.root.direction() === 'rtl' ? -1 : 1)
  readonly virtualizer = injectVirtualizer<HTMLDivElement, HTMLDivElement>(() => ({ scrollElement: this.scrollElement(), count: this.items().length, getItemKey: index => this.getItemKey()(this.items()[index] as T, index), estimateSize: index => this.estimateSize()(this.items()[index] as T, index), overscan: this.overscan(), gap: this.gap().row, lanes: this.columnCount(), laneAssignmentMode: 'measured' }))
  constructor() { effect(() => { const elements = this.itemElements(); queueMicrotask(() => elements.forEach(element => this.virtualizer.measureElement(element.nativeElement))) }) }
}
export type { MasonryColumns, MasonryGap, MasonryLayoutDetail, MasonryPlacement } from '@fex-design/core/masonry/types'
