import {
  popoverArrowClassName,
  popoverContentClassName,
  popoverDescriptionClassName,
  popoverHeaderClassName,
  popoverTitleClassName,
} from "@fex/components-styles/popover";
import {
  createFloatingOverlay,
  type FloatingOverlayOptions,
} from "@fex/components-core/overlay/create-floating-overlay";
import type { OverlayTrigger } from "@fex/components-core/overlay/trigger/create-trigger";
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Injectable,
  Output,
  inject,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { DestroyRef } from "@angular/core";
import type { AfterViewInit, OnChanges, OnDestroy } from "@angular/core";
import { createCoreStoreSignal } from "../../signals/core-store-signal";
import { createHostClassName } from "../../signals/host-class";
import { PopoverDomService, type PopoverPortalMount } from "./popover-dom";

function eventInfo(event: Event & Partial<PointerEvent>) {
  // Angular HostListener 传入原生事件，这里统一转换成 core 使用的框架无关事件快照。
  return {
    target: event.target,
    currentTarget: event.currentTarget,
    clientX: event.clientX,
    clientY: event.clientY,
    button: event.button,
    pointerType: event.pointerType,
    event,
    preventDefault: event.preventDefault.bind(event),
    stopPropagation: event.stopPropagation.bind(event),
  };
}

@Injectable({ providedIn: "root" })
export class PopoverRegistry {
  private readonly popovers = new Set<Popover>();
  private readonly document = inject(DOCUMENT);

  constructor() {
    const listener = (event: PointerEvent) => this.closeOutsidePopovers(event);
    this.document.addEventListener("pointerdown", listener, true);
    inject(DestroyRef).onDestroy(() =>
      this.document.removeEventListener("pointerdown", listener, true),
    );
  }

  register(popover: Popover) {
    this.popovers.add(popover);
    return () => {
      this.popovers.delete(popover);
    };
  }

  closeOtherPopovers(current: Popover, event: Event) {
    this.popovers.forEach((popover) => {
      if (popover !== current && popover.snapshot().open) {
        popover.overlay.close({ reason: "outside-pointer", event });
      }
    });
  }

  closeOutsidePopovers(event: Event) {
    const target = event.target;
    this.popovers.forEach((popover) => {
      if (!popover.snapshot().open) return;
      const NodeConstructor = this.document.defaultView?.Node;
      if (NodeConstructor && target instanceof NodeConstructor) {
        // content 会被移动到 popup container，必须用真实 DOM 边界判断内外部。
        if (
          popover.referenceElement?.contains(target) ||
          popover.contentElement?.contains(target) ||
          popover.arrowElement?.contains(target)
        ) {
          return;
        }
      }
      popover.overlay.close({ reason: "outside-pointer", event });
    });
  }
}

@Component({
  selector: "fex-popover",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: "<ng-content />",
})
export class Popover implements OnChanges, OnDestroy {
  private readonly registry = inject(PopoverRegistry);
  @Input() open?: boolean;
  @Input() defaultOpen = false;
  @Input() trigger: OverlayTrigger[] = ["click"];
  @Input() placement?: FloatingOverlayOptions["placement"];
  @Input() side?: FloatingOverlayOptions["side"];
  @Input() align?: FloatingOverlayOptions["align"];
  @Input() alignOffset?: number;
  @Input() sideOffset = 6;
  @Input() arrow = false;
  @Input() getPopupContainer?: FloatingOverlayOptions["getPopupContainer"];
  @Input() hoverCloseDelay?: number;
  @Input() hoverOpenDelay?: number;
  @Output() openChange = new EventEmitter<boolean>();

  private localOpen = this.defaultOpen;
  // 这些 DOM 引用是 adapter 和 core 之间的桥：trigger 用于定位，content/arrow 用于浮层边界和箭头计算。
  referenceElement: HTMLElement | null = null;
  contentElement: HTMLElement | null = null;
  arrowElement: HTMLElement | null = null;
  readonly overlay = createFloatingOverlay({
    open: this.open ?? this.localOpen,
    trigger: this.trigger,
    placement: this.placement,
    side: this.side,
    align: this.align,
    alignOffset: this.alignOffset,
    sideOffset: this.sideOffset,
    arrow: this.arrow,
    getPopupContainer: this.getPopupContainer,
    hoverCloseDelay: this.hoverCloseDelay,
    hoverOpenDelay: this.hoverOpenDelay,
    onOpenChange: (nextOpen) => {
      if (this.open === undefined) {
        // 非受控模式写本地状态；受控模式等待 @Input open 回流。
        this.localOpen = nextOpen;
        this.syncOptions();
      }
      this.openChange.emit(nextOpen);
    },
  });
  readonly snapshot = createCoreStoreSignal(this.overlay);

  private readonly unregister = this.registry.register(this);

  syncOptions() {
    // overlay 是外部命令式实例；Angular input 变化时只同步 options，不重建实例。
    this.overlay.setOptions({
      open: this.open ?? this.localOpen,
      trigger: this.trigger,
      placement: this.placement,
      side: this.side,
      align: this.align,
      alignOffset: this.alignOffset,
      sideOffset: this.sideOffset,
      arrow: this.arrow,
      getPopupContainer: this.getPopupContainer,
      hoverCloseDelay: this.hoverCloseDelay,
      hoverOpenDelay: this.hoverOpenDelay,
      onOpenChange: (nextOpen) => {
        if (this.open === undefined) {
          this.localOpen = nextOpen;
          this.syncOptions();
        }
        this.openChange.emit(nextOpen);
      },
    });
  }

  ngOnChanges() {
    this.syncOptions();
  }

  ngOnDestroy() {
    this.unregister();
    this.overlay.destroy();
  }
}

@Directive({
  selector: "[fexPopoverTrigger]",
  standalone: true,
  host: {
    type: "button",
    "[attr.data-state]": "popover.snapshot().open ? 'open' : 'closed'",
  },
})
export class PopoverTrigger implements AfterViewInit {
  protected readonly popover = inject(Popover);
  private readonly registry = inject(PopoverRegistry);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  ngAfterViewInit() {
    // View 初始化后才能拿到真实 button DOM，并注册给 floating 作为 reference。
    this.popover.referenceElement = this.elementRef.nativeElement;
    this.popover.overlay.setReferenceElement(this.elementRef.nativeElement);
  }

  @HostListener("click", ["$event"])
  click(event: MouseEvent) {
    // 点击型 Popover 默认互斥，先关闭其它实例，再把本次点击交给 core trigger。
    this.registry.closeOtherPopovers(this.popover, event);
    this.popover.syncOptions();
    this.popover.overlay.trigger.click(eventInfo(event));
  }

  @HostListener("pointerenter", ["$event"])
  pointerEnter(event: PointerEvent) {
    this.popover.overlay.trigger.pointerEnter(eventInfo(event));
  }

  @HostListener("pointerleave", ["$event"])
  pointerLeave(event: PointerEvent) {
    this.popover.overlay.trigger.pointerLeave(eventInfo(event));
  }

  @HostListener("focus", ["$event"])
  focus(event: FocusEvent) {
    this.popover.overlay.trigger.focus(eventInfo(event));
  }

  @HostListener("blur", ["$event"])
  blur(event: FocusEvent) {
    this.popover.overlay.trigger.blur(eventInfo(event));
  }

  @HostListener("contextmenu", ["$event"])
  contextMenu(event: MouseEvent) {
    this.registry.closeOtherPopovers(this.popover, event);
    this.popover.overlay.trigger.contextMenu(eventInfo(event));
  }
}

@Component({
  selector: "fex-popover-content",
  standalone: true,
  providers: [PopoverDomService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: "dialog",
    tabindex: "-1",
    "data-slot": "popover-content",
    "[class]": "hostClassName()",
    "[style.position]": "'var(--floating-strategy, absolute)'",
    "[style.left]": "'var(--floating-x, 0px)'",
    "[style.top]": "'var(--floating-y, 0px)'",
    "[style.display]": "popover.snapshot().mounted ? null : 'none'",
    "[style.transform-origin]": "'var(--floating-transform-origin)'",
    "[attr.data-state]": "popover.snapshot().open ? 'open' : 'closed'",
    "[attr.data-phase]": "popover.snapshot().phase",
    "[attr.data-side]": "popover.snapshot().side",
    "[attr.data-align]": "popover.snapshot().align",
    "[attr.data-placement]": "popover.snapshot().placement",
  },
  template: "<ng-content />",
})
export class PopoverContent implements AfterViewInit, OnDestroy {
  protected readonly popover = inject(Popover);
  private readonly domService = inject(PopoverDomService);
  private readonly elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);
  private portalMount?: PopoverPortalMount;
  protected readonly hostClassName = createHostClassName(popoverContentClassName());

  ngAfterViewInit() {
    const element = this.elementRef.nativeElement;
    const popupContainer = this.popover.overlay.resolvePopupContainer();
    // Angular 通过 DOM service 把 content 移到容器，移动后仍然注册真实 element 给 core。
    this.portalMount = this.domService.mountFloatingElement(element, popupContainer);
    this.popover.contentElement = element;
    this.popover.overlay.setFloatingElement(element);

  }

  ngOnDestroy() {
    if (this.popover.contentElement === this.elementRef.nativeElement) {
      this.popover.contentElement = null;
    }
    this.popover.overlay.setFloatingElement(null);
    this.portalMount?.cleanup();
  }
}

@Component({
  selector: "fex-popover-arrow",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "data-slot": "popover-arrow",
    "[class]": "hostClassName()",
    "[style.left]": "popover.snapshot().side === 'left' || popover.snapshot().side === 'right' ? null : 'clamp(var(--popover-arrow-inset,32px), var(--floating-arrow-x,50%), calc(100% - var(--popover-arrow-inset,32px)))'",
    "[style.top]": "popover.snapshot().side === 'left' || popover.snapshot().side === 'right' ? 'clamp(var(--popover-arrow-inset,32px), var(--floating-arrow-y,50%), calc(100% - var(--popover-arrow-inset,32px)))' : null",
    "[attr.data-side]": "popover.snapshot().side",
  },
  template: "",
})
export class PopoverArrow implements AfterViewInit, OnDestroy {
  protected readonly popover = inject(Popover);
  private readonly elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);
  protected readonly hostClassName = createHostClassName(popoverArrowClassName);

  ngAfterViewInit() {
    const element = this.elementRef.nativeElement;
    // arrow 是 Floating UI arrow middleware 的输入，注册后 core 会写入箭头坐标。
    this.popover.arrowElement = element;
    this.popover.overlay.setArrowElement(element);
  }

  ngOnDestroy() {
    if (this.popover.arrowElement === this.elementRef.nativeElement) {
      this.popover.arrowElement = null;
    }
    this.popover.overlay.setArrowElement(null);
  }
}

@Component({
  selector: "fex-popover-header",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[class]": "hostClassName()", "data-slot": "popover-header" },
  template: "<ng-content />",
})
export class PopoverHeader {
  protected readonly hostClassName = createHostClassName(popoverHeaderClassName);
}

@Component({
  selector: "fex-popover-title",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[class]": "hostClassName()", "data-slot": "popover-title" },
  template: "<ng-content />",
})
export class PopoverTitle {
  protected readonly hostClassName = createHostClassName(popoverTitleClassName);
}

@Component({
  selector: "fex-popover-description",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[class]": "hostClassName()", "data-slot": "popover-description" },
  template: "<ng-content />",
})
export class PopoverDescription {
  protected readonly hostClassName = createHostClassName(popoverDescriptionClassName);
}
