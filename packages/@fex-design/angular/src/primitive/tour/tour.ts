import { ChangeDetectionStrategy, Component, ContentChild, Directive, ElementRef, EventEmitter, HostListener, Input, Output, inject, effect, type AfterViewInit, type OnChanges, type OnDestroy, type SimpleChanges } from '@angular/core'
import { createFloating, type Floating } from '@fex-design/core/floating/create-floating'
import { createTourController } from '@fex-design/core/tour/create-tour-controller'
import type { TourController, TourOptions, TourStepOptions } from '@fex-design/core/tour/types'
import { tourArrowClassName, tourContentClassName, tourControlClassName, tourOverlayClassName } from '@fex-design/styles/tour'
import { createCoreStoreSignalBinding } from '../../signals/core-store-signal'
import { createHostClassName } from '../../signals/host-class'
import { PopoverDomService, type PopoverPortalMount } from '../popover/popover-dom'

@Component({ selector: 'fex-tour', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, template: '<ng-content />' })
export class TourRoot implements OnChanges, OnDestroy {
  @Input() open?: boolean
  @Input() defaultOpen = false
  @Input() current?: number
  @Input() defaultCurrent = 0
  @Input() keyboard = true
  @Input() overlay = true
  @Input() closeOnOverlayClick = true
  @Input() defaultGap = 6
  @Input() zIndex = 1001
  @Input() targetMissing?: TourOptions['targetMissing']
  @Input() targetTimeout?: number
  @Output() openChange = new EventEmitter<boolean>()
  @Output() change = new EventEmitter<number>()
  @Output() close = new EventEmitter<unknown>()
  @Output() finish = new EventEmitter<void>()
  readonly controller: TourController = createTourController({ defaultOpen: false })
  readonly binding = createCoreStoreSignalBinding(this.controller)
  readonly snapshot = this.binding.snapshot
  private localOpen = false
  private initialized = false
  ngOnChanges(changes: SimpleChanges) {
    if (!this.initialized && changes['defaultOpen']) { this.localOpen = this.defaultOpen; this.initialized = true }
    this.controller.setOptions(this.options())
  }
  private options(): TourOptions {
    const options: TourOptions = { open: this.open ?? this.localOpen, defaultCurrent: this.defaultCurrent, onOpenChange: (value, info) => { if (this.open === undefined) { this.localOpen = value; this.controller.setOptions(this.options()) } this.openChange.emit(value); if (!value) this.close.emit(info) }, onChange: (index) => this.change.emit(index), onFinish: () => this.finish.emit() }
    if (this.current !== undefined) options.current = this.current
    if (this.targetMissing !== undefined) options.targetMissing = this.targetMissing
    if (this.targetTimeout !== undefined) options.targetTimeout = this.targetTimeout
    return options
  }
  openTour() { this.controller.open() }
  closeTour() { this.controller.close() }
  ngOnDestroy() { this.controller.destroy() }
  @HostListener('document:keydown', ['$event']) keydown(event: KeyboardEvent) { if (!this.snapshot().open || !this.keyboard) return; if (event.key === 'Escape') { event.preventDefault(); this.controller.close() } else if (event.key === 'ArrowRight') { event.preventDefault(); void this.controller.next() } else if (event.key === 'ArrowLeft') { event.preventDefault(); void this.controller.previous() } }
  @HostListener('window:resize') resize() { this.controller.refreshTarget() }
  @HostListener('window:scroll') scroll() { this.controller.refreshTarget() }
}

@Component({ selector: 'fex-tour-step', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { '[style.display]': "root.snapshot().currentStep?.name === name ? null : 'none'" }, template: '<ng-content />' })
export class TourStep implements OnChanges, OnDestroy {
  protected readonly root = inject(TourRoot)
  @Input({ required: true }) name!: string
  @Input() target?: string | null
  @Input() placement?: TourStepOptions['placement']
  @Input() arrow?: TourStepOptions['arrow']
  @Input() mask?: TourStepOptions['mask']
  @Input() gap?: TourStepOptions['gap']
  @Input() scrollIntoViewOptions?: TourStepOptions['scrollIntoViewOptions']
  @Input() disabledInteraction?: boolean
  private unregister?: () => void
  ngOnChanges() {
    this.unregister?.()
    const step: TourStepOptions = { name: this.name, target: this.target ?? null }
    if (this.placement !== undefined) step.placement = this.placement
    if (this.arrow !== undefined) step.arrow = this.arrow
    if (this.mask !== undefined) step.mask = this.mask
    if (this.gap !== undefined) step.gap = this.gap
    if (this.scrollIntoViewOptions !== undefined) step.scrollIntoViewOptions = this.scrollIntoViewOptions
    if (this.disabledInteraction !== undefined) step.disabledInteraction = this.disabledInteraction
    this.unregister = this.root.controller.registerStep(step)
  }
  ngOnDestroy() { this.unregister?.() }
}

@Directive({ selector: '[fexTourTarget]', standalone: true })
export class TourTarget implements AfterViewInit, OnDestroy {
  @Input('fexTourTarget') name!: string
  private readonly root = inject(TourRoot)
  private readonly element = inject(ElementRef<HTMLElement>).nativeElement
  private unregister?: () => void
  ngAfterViewInit() { this.unregister = this.root.controller.registerTarget(this.name, () => this.element); this.root.controller.refreshTarget() }
  ngOnDestroy() { this.unregister?.(); this.root.controller.refreshTarget() }
}

@Component({ selector: 'fex-tour-portal', standalone: true, providers: [PopoverDomService], changeDetection: ChangeDetectionStrategy.OnPush, host: { 'data-slot': 'tour-portal', style: 'display: contents' }, template: '<ng-content />' })
export class TourPortal implements AfterViewInit, OnDestroy {
  @Input() container?: HTMLElement | null
  private readonly root = inject(TourRoot)
  private readonly dom = inject(PopoverDomService)
  private readonly element = inject(ElementRef<HTMLElement>).nativeElement
  private mount?: PopoverPortalMount
  ngAfterViewInit() { this.mount = this.dom.mountFloatingElement(this.element, this.container) }
  ngOnDestroy() { this.mount?.cleanup() }
}

@Directive({ selector: '[fexTourOverlayContent]', standalone: true })
export class TourOverlayContent {}

@Component({ selector: 'fex-tour-overlay', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './tour-overlay.html', host: { '[class]': 'hostClassName()', '[style.z-index]': 'root.zIndex - 1', '[style.pointer-events]': "root.snapshot().currentStep?.disabledInteraction ? 'auto' : 'none'", '[style.display]': "root.snapshot().open && root.snapshot().currentStep?.mask !== false && root.overlay ? null : 'none'", 'data-slot': 'tour-overlay' } })
export class TourOverlay {
  protected readonly root = inject(TourRoot)
  protected readonly hostClassName = createHostClassName(tourOverlayClassName)
  @ContentChild(TourOverlayContent) readonly customContent?: TourOverlayContent
  readonly maskId = `fex-tour-mask-${Math.random().toString(36).slice(2)}`
  targetRect() { return this.root.snapshot().targetRect }
  viewportWidth() { return document.documentElement.clientWidth || window.innerWidth }
  viewportHeight() { return document.documentElement.clientHeight || window.innerHeight }
  gap() { return this.root.snapshot().currentStep?.gap?.offset ?? this.root.defaultGap }
  color() { const mask = this.root.snapshot().currentStep?.mask; return typeof mask === 'object' && mask.color ? mask.color : 'rgba(15, 23, 42, 0.58)' }
  @HostListener('click', ['$event']) click(event: MouseEvent) { if (this.root.closeOnOverlayClick && event.target === event.currentTarget) this.root.closeTour() }
}

@Component({ selector: 'fex-tour-content', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, template: '<ng-content />', host: { role: 'dialog', tabindex: '-1', '[class]': 'hostClassName()', '[style.position]': "'var(--floating-strategy, absolute)'", '[style.left]': "'var(--floating-x, 0px)'", '[style.top]': "'var(--floating-y, 0px)'", '[style.transform-origin]': "'var(--floating-transform-origin)'", '[style.z-index]': 'root.zIndex', '[style.display]': "root.snapshot().open ? null : 'none'", '[attr.data-side]': 'floatingSnapshot().side', '[attr.data-placement]': 'floatingSnapshot().placement', 'data-slot': 'tour-content' } })
export class TourContent implements AfterViewInit, OnDestroy {
  protected readonly root = inject(TourRoot)
  protected readonly hostClassName = createHostClassName(tourContentClassName)
  readonly floating: Floating = createFloating({ placement: 'bottom', arrow: true, offset: 12 })
  readonly floatingSnapshot = createCoreStoreSignalBinding(this.floating).snapshot
  private readonly element = inject(ElementRef<HTMLDivElement>).nativeElement
  private readonly sync = effect(() => { const step = this.root.snapshot().currentStep; const gap = step?.gap?.offset ?? this.root.defaultGap; this.floating.setOptions({ placement: step?.placement ?? 'bottom', arrow: step?.arrow !== false, offset: (Array.isArray(gap) ? Math.max(gap[0], gap[1]) : gap) + 12 }); this.floating.setReferenceElement(step?.target ? this.root.controller.getTarget(step.target) : null); if (this.root.snapshot().open) this.floating.startAutoUpdate(); else this.floating.stopAutoUpdate() })
  ngAfterViewInit() { this.floating.setFloatingElement(this.element) }
  ngOnDestroy() { this.floating.setFloatingElement(null); this.floating.destroy(); this.sync.destroy() }
}

@Component({ selector: 'fex-tour-arrow', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, template: '', host: { '[class]': 'hostClassName()', '[attr.data-side]': 'content.floatingSnapshot().side', '[style]': 'position()', 'data-slot': 'tour-arrow' } })
export class TourArrow implements AfterViewInit, OnDestroy {
  protected readonly content = inject(TourContent)
  protected readonly hostClassName = createHostClassName(tourArrowClassName)
  private readonly element = inject(ElementRef<HTMLDivElement>).nativeElement
  position() { const side = this.content.floatingSnapshot().side; if (side === 'top') return 'bottom:-6px;left:var(--floating-arrow-x,50%);border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid var(--background)'; if (side === 'bottom') return 'top:-6px;left:var(--floating-arrow-x,50%);border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:6px solid var(--background)'; if (side === 'left') return 'right:-6px;top:var(--floating-arrow-y,50%);border-top:6px solid transparent;border-bottom:6px solid transparent;border-left:6px solid var(--background)'; return 'left:-6px;top:var(--floating-arrow-y,50%);border-top:6px solid transparent;border-bottom:6px solid transparent;border-right:6px solid var(--background)' }
  ngAfterViewInit() { this.content.floating.setArrowElement(this.element) }
  ngOnDestroy() { this.content.floating.setArrowElement(null) }
}

@Component({ selector: 'fex-tour-control', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, template: '<ng-content />', host: { role: 'button', tabindex: '0', '[class]': 'hostClassName()', '[attr.data-tour-action]': 'action', '[attr.aria-disabled]': 'isDisabled() ? "true" : null', 'data-slot': 'tour-control' } })
export class TourControl {
  @Input({ required: true }) action!: 'previous' | 'next' | 'skip' | 'close' | 'complete'
  @Input() disabled = false
  protected readonly root = inject(TourRoot)
  protected readonly hostClassName = createHostClassName(tourControlClassName)
  protected disabledValue() { return this.disabled || (this.action === 'previous' && this.root.snapshot().isFirst) }
  isDisabled() { return this.disabledValue() }
  @HostListener('click', ['$event']) click(event: Event) { if (this.disabledValue()) { event.preventDefault(); return } if (this.action === 'previous') void this.root.controller.previous(); else if (this.action === 'next') void this.root.controller.next(); else if (this.action === 'skip') this.root.controller.skip(); else if (this.action === 'close') this.root.controller.close(); else this.root.controller.complete() }
  @HostListener('keydown', ['$event']) keydown(event: KeyboardEvent) { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); this.click(event) } }
}

export { type TourController, type TourOptions, type TourStepOptions }
