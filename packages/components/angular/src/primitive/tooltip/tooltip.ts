import { ChangeDetectionStrategy, Component, Directive, ElementRef, EventEmitter, HostListener, Input, Output, inject, type AfterViewInit, type OnChanges, type OnDestroy } from '@angular/core'
import { createTooltip, getTooltipArrowPosition, type Tooltip as TooltipCore, type TooltipOptions } from '@fex/components-core/tooltip/create-tooltip'
import { tooltipArrowClassName, tooltipContentClassName } from '@fex/components-styles/tooltip'
import { createCoreStoreSignal } from '../../signals/core-store-signal'
import { createHostClassName } from '../../signals/host-class'
import { PopoverDomService, type PopoverPortalMount } from '../popover/popover-dom'

let tooltipId = 0
const eventInfo = (event: Event) => ({ target: event.target, currentTarget: event.currentTarget, event })

@Component({
  selector: 'fex-tooltip', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: '<ng-content />',
})
export class Tooltip implements OnChanges, OnDestroy {
  @Input() open?: boolean
  @Input() defaultOpen = false
  @Input() disabled?: boolean
  @Input() placement?: TooltipOptions['placement']
  @Input() side?: TooltipOptions['side']
  @Input() align?: TooltipOptions['align']
  @Input() sideOffset?: number
  @Input() alignOffset?: number
  @Input() hoverOpenDelay?: number
  @Input() hoverCloseDelay?: number
  @Input() closeDelay?: number
  @Input() getPopupContainer?: TooltipOptions['getPopupContainer']
  @Output() openChange = new EventEmitter<boolean>()
  readonly contentId = `fex-tooltip-${++tooltipId}`
  private localOpen = this.defaultOpen
  readonly overlay: TooltipCore = createTooltip(this.options())
  readonly snapshot = createCoreStoreSignal(this.overlay)
  private options(): TooltipOptions {
    return { open: this.open ?? this.localOpen, disabled: this.disabled, placement: this.placement, side: this.side, align: this.align,
      sideOffset: this.sideOffset, alignOffset: this.alignOffset, hoverOpenDelay: this.hoverOpenDelay, hoverCloseDelay: this.hoverCloseDelay,
      closeDelay: this.closeDelay, getPopupContainer: this.getPopupContainer, onOpenChange: (open) => { if (this.open === undefined) { this.localOpen = open; this.overlay?.setOptions(this.options()) } this.openChange.emit(open) } }
  }
  ngOnChanges() { this.overlay.setOptions(this.options()) }
  ngOnDestroy() { this.overlay.destroy() }
}

@Directive({
  selector: '[fexTooltipTrigger]', standalone: true,
  host: { '[attr.aria-describedby]': 'describedBy()', '[attr.data-state]': "tooltip.snapshot().open ? 'open' : 'closed'" },
})
export class TooltipTrigger implements AfterViewInit, OnDestroy {
  protected readonly tooltip = inject(Tooltip)
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  protected readonly originalDescribedBy = this.element.getAttribute('aria-describedby')
  protected describedBy() {
    if (!this.tooltip.snapshot().mounted) return this.originalDescribedBy
    return [this.originalDescribedBy, this.tooltip.contentId].filter(Boolean).join(' ')
  }
  ngAfterViewInit() { this.tooltip.overlay.setReferenceElement(this.element) }
  ngOnDestroy() { this.tooltip.overlay.setReferenceElement(null) }
  @HostListener('pointerenter', ['$event']) pointerEnter(event: PointerEvent) { this.tooltip.overlay.trigger.pointerEnter(eventInfo(event)) }
  @HostListener('pointerleave', ['$event']) pointerLeave(event: PointerEvent) { this.tooltip.overlay.trigger.pointerLeave(eventInfo(event)) }
  @HostListener('focus', ['$event']) focus(event: FocusEvent) { this.tooltip.overlay.trigger.focus(eventInfo(event)) }
  @HostListener('blur', ['$event']) blur(event: FocusEvent) { this.tooltip.overlay.trigger.blur(eventInfo(event)) }
}

@Component({ selector: 'fex-tooltip-portal', standalone: true, providers: [PopoverDomService], changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'tooltip-portal', style: 'display: contents' }, template: '<ng-content />' })
export class TooltipPortal implements AfterViewInit, OnDestroy {
  @Input() container?: HTMLElement | null
  private readonly tooltip = inject(Tooltip)
  private readonly dom = inject(PopoverDomService)
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private mount?: PopoverPortalMount
  ngAfterViewInit() { this.mount = this.dom.mountFloatingElement(this.host, this.container ?? this.tooltip.overlay.resolvePopupContainer()) }
  ngOnDestroy() { this.mount?.cleanup() }
}

@Component({ selector: 'fex-tooltip-content', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'tooltip', 'data-slot': 'tooltip-content', '[id]': 'tooltip.contentId', '[class]': 'hostClassName()',
    '[style.position]': "'var(--floating-strategy, absolute)'", '[style.left]': "'var(--floating-x, 0px)'", '[style.top]': "'var(--floating-y, 0px)'",
    '[style.display]': "tooltip.snapshot().mounted ? null : 'none'", '[style.transform-origin]': "'var(--floating-transform-origin)'",
    '[attr.data-state]': "tooltip.snapshot().open ? 'open' : 'closed'", '[attr.data-phase]': 'tooltip.snapshot().phase',
    '[attr.data-side]': 'tooltip.snapshot().side', '[attr.data-align]': 'tooltip.snapshot().align', '[attr.data-placement]': 'tooltip.snapshot().placement' },
  template: '<ng-content />' })
export class TooltipContent implements AfterViewInit, OnDestroy {
  protected readonly tooltip = inject(Tooltip)
  protected readonly hostClassName = createHostClassName(tooltipContentClassName)
  private readonly element = inject<ElementRef<HTMLDivElement>>(ElementRef).nativeElement
  ngAfterViewInit() { this.tooltip.overlay.setFloatingElement(this.element) }
  ngOnDestroy() { this.tooltip.overlay.setFloatingElement(null) }
}

@Component({ selector: 'fex-tooltip-arrow', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'tooltip-arrow', '[class]': 'hostClassName()', '[attr.data-side]': 'tooltip.snapshot().side',
    '[attr.data-align]': 'tooltip.snapshot().align', '[style.left]': 'arrowPosition().left ?? null',
    '[style.top]': 'arrowPosition().top ?? null' }, template: '' })
export class TooltipArrow implements AfterViewInit, OnDestroy {
  protected readonly tooltip = inject(Tooltip)
  protected readonly hostClassName = createHostClassName(tooltipArrowClassName)
  private readonly element = inject<ElementRef<HTMLDivElement>>(ElementRef).nativeElement
  protected arrowPosition() { return getTooltipArrowPosition(this.tooltip.snapshot().side, this.tooltip.snapshot().align) }
  ngAfterViewInit() { this.tooltip.overlay.setArrowElement(this.element) }
  ngOnDestroy() { this.tooltip.overlay.setArrowElement(null) }
}
