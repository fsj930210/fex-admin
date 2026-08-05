import { DOCUMENT } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  inject,
} from '@angular/core'
import type { AfterViewInit, OnChanges, OnDestroy } from '@angular/core'
import { createContextMenuController } from '@fex-design/core/overlay/context-menu/create-context-menu-controller'
import type { ContextMenuOptions } from '@fex-design/core/overlay/context-menu/types'
import { popoverContentClassName, popoverMenuContentClassName } from '@fex-design/styles/popover'
import { cn } from '@fex/utils'
import { createCoreStoreSignal } from '../../signals/core-store-signal'
import { createHostClassName } from '../../signals/host-class'
import { PopoverDomService, type PopoverPortalMount } from '../popover/popover-dom'

function eventInfo(event: Event & Partial<PointerEvent>) {
  return { target: event.target, currentTarget: event.currentTarget, clientX: event.clientX, clientY: event.clientY, button: event.button, pointerType: event.pointerType, event, preventDefault: event.preventDefault.bind(event), stopPropagation: event.stopPropagation.bind(event) }
}

@Component({
  selector: 'fex-context-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
})
export class ContextMenu implements OnChanges, OnDestroy {
  @Input() open?: boolean
  @Input() defaultOpen = false
  @Input() side: ContextMenuOptions<unknown>['side'] = 'right'
  @Input() align: ContextMenuOptions<unknown>['align'] = 'start'
  @Input() sideOffset = 2
  @Input() getPopupContainer?: ContextMenuOptions<unknown>['getPopupContainer']
  @Output() openChange = new EventEmitter<boolean>()
  private localOpen = this.defaultOpen
  referenceElement: HTMLElement | null = null
  contentElement: HTMLElement | null = null
  readonly controller = createContextMenuController({
    open: this.open ?? this.localOpen,
    side: this.side,
    align: this.align,
    sideOffset: this.sideOffset,
    getPopupContainer: this.getPopupContainer,
    onOpenChange: (open) => this.handleOpenChange(open),
  })
  readonly snapshot = createCoreStoreSignal(this.controller)

  private handleOpenChange(open: boolean) {
    if (this.open === undefined) {
      this.localOpen = open
      this.syncOptions()
    }
    this.openChange.emit(open)
  }

  syncOptions() {
    this.controller.setOptions({
      open: this.open ?? this.localOpen,
      side: this.side,
      align: this.align,
      sideOffset: this.sideOffset,
      getPopupContainer: this.getPopupContainer,
      onOpenChange: (open) => this.handleOpenChange(open),
    })
  }

  ngOnChanges() { this.syncOptions() }
  ngOnDestroy() { this.controller.destroy() }
}

@Directive({
  selector: '[fexContextMenuTrigger]',
  standalone: true,
  host: {
    '[attr.aria-haspopup]': "'menu'",
    '[attr.data-state]': "contextMenu.snapshot().overlay.open ? 'open' : 'closed'",
  },
})
export class ContextMenuTrigger implements AfterViewInit, OnDestroy {
  protected readonly contextMenu = inject(ContextMenu)
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
  @Input('fexContextMenuTrigger') payload?: unknown

  ngAfterViewInit() {
    this.contextMenu.referenceElement = this.elementRef.nativeElement
    this.contextMenu.controller.overlay.setReferenceElement(this.elementRef.nativeElement)
  }

  @HostListener('contextmenu', ['$event'])
  contextMenuEvent(event: MouseEvent) {
    const element = this.elementRef.nativeElement
    this.contextMenu.controller.openAt({ payload: this.payload, element, clientX: event.clientX, clientY: event.clientY, event }, eventInfo(event))
  }

  @HostListener('keydown', ['$event'])
  keydown(event: KeyboardEvent) {
    if ((event.shiftKey && event.key === 'F10') || event.key === 'ContextMenu') {
      event.preventDefault()
      const element = this.elementRef.nativeElement
      const rect = element.getBoundingClientRect()
      this.contextMenu.controller.openAt({ payload: this.payload, element, clientX: rect.left, clientY: rect.bottom, event }, eventInfo(event))
    }
  }

  ngOnDestroy() { this.contextMenu.controller.overlay.setReferenceElement(null) }
}

@Component({
  selector: 'fex-context-menu-portal',
  standalone: true,
  providers: [PopoverDomService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: '<ng-content />',
})
export class ContextMenuPortal implements AfterViewInit, OnDestroy {
  private readonly contextMenu = inject(ContextMenu)
  private readonly domService = inject(PopoverDomService)
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
  private portalMount?: PopoverPortalMount
  ngAfterViewInit() {
    this.portalMount = this.domService.mountFloatingElement(this.elementRef.nativeElement, this.contextMenu.controller.overlay.resolvePopupContainer())
  }
  ngOnDestroy() { this.portalMount?.cleanup() }
}

@Component({
  selector: 'fex-context-menu-content',
  standalone: true,
  providers: [PopoverDomService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'menu',
    tabindex: '-1',
    'data-slot': 'context-menu-content',
    '[class]': 'hostClassName() || contentClassName',
    '[style.position]': "'var(--floating-strategy, absolute)'",
    '[style.left]': "'var(--floating-x, 0px)'",
    '[style.top]': "'var(--floating-y, 0px)'",
    '[style.display]': "contextMenu.snapshot().overlay.mounted ? null : 'none'",
    '[attr.data-state]': "contextMenu.snapshot().overlay.open ? 'open' : 'closed'",
    '[attr.data-phase]': 'contextMenu.snapshot().overlay.phase',
    '[attr.data-side]': 'contextMenu.snapshot().overlay.side',
    '[attr.data-align]': 'contextMenu.snapshot().overlay.align',
  },
  template: '<ng-content />',
})
export class ContextMenuContent implements AfterViewInit, OnDestroy {
  protected readonly contextMenu = inject(ContextMenu)
  private readonly portal = inject(ContextMenuPortal, { optional: true })
  private readonly domService = inject(PopoverDomService)
  private readonly elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef)
  private legacyPortalMount?: PopoverPortalMount
  protected readonly contentClassName = cn(popoverContentClassName(), popoverMenuContentClassName)
  protected readonly hostClassName = createHostClassName(this.contentClassName)
  ngAfterViewInit() {
    const element = this.elementRef.nativeElement
    if (!this.portal) this.legacyPortalMount = this.domService.mountFloatingElement(element, this.contextMenu.controller.overlay.resolvePopupContainer())
    this.contextMenu.contentElement = element
    this.contextMenu.controller.overlay.setFloatingElement(element)
  }
  ngOnDestroy() {
    if (this.contextMenu.contentElement === this.elementRef.nativeElement) this.contextMenu.contentElement = null
    this.contextMenu.controller.overlay.setFloatingElement(null)
    this.legacyPortalMount?.cleanup()
  }
}

@Component({
  selector: 'button[fexContextMenuItem]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { type: 'button', role: 'menuitem' },
  template: '<ng-content />',
})
export class ContextMenuItem {
  private readonly contextMenu = inject(ContextMenu)
  @HostListener('click', ['$event'])
  click(event: MouseEvent) { if (!event.defaultPrevented) this.contextMenu.controller.overlay.close({ reason: 'manual', source: 'menu-item', event }) }
}
