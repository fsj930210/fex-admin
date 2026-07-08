import { createDialogController } from "@fex/components-core/dialog/create-dialog-controller";
import type { DialogOptions } from "@fex/components-core/dialog/create-dialog-controller";
import {
  dialogBodyClassName,
  dialogContentClassName,
  dialogDescriptionClassName,
  dialogFooterClassName,
  dialogHeaderClassName,
  dialogOverlayClassName,
  dialogTitleClassName,
} from "@fex/components-styles/dialog";
import type { DialogStyleProps } from "@fex/components-styles/dialog";
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
} from "@angular/core";
import type { AfterViewInit, OnChanges, OnDestroy } from "@angular/core";
import { createCoreStoreSignal } from "../../signals/core-store-signal";
import { createHostClassName } from "../../signals/host-class";

let nextDialogId = 1;

@Component({
  selector: "fex-dialog",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: "<ng-content />",
})
export class Dialog implements OnChanges, OnDestroy {
  @Input() open?: boolean;
  @Input() defaultOpen = false;
  @Input() modal = true;
  @Input() forceMount = false;
  @Input() closeDelay = 140;
  @Input() closeOnOverlayPointer = true;
  @Input() dismiss?: DialogOptions["dismiss"];
  @Output() openChange = new EventEmitter<boolean>();

  private localOpen = this.defaultOpen;
  readonly contentId = `fex-dialog-content-${nextDialogId}`;
  readonly titleId = `fex-dialog-title-${nextDialogId}`;
  readonly descriptionId = `fex-dialog-description-${nextDialogId++}`;
  triggerElement: HTMLButtonElement | null = null;
  readonly dialog = createDialogController(this.createOptions());
  readonly snapshot = createCoreStoreSignal(this.dialog);

  private createOptions(): DialogOptions {
    return {
      open: this.open ?? this.localOpen,
      modal: this.modal,
      forceMount: this.forceMount,
      closeDelay: this.closeDelay,
      closeOnOverlayPointer: this.closeOnOverlayPointer,
      dismiss: this.dismiss,
      onOpenChange: (nextOpen) => {
        if (this.open === undefined) {
          this.localOpen = nextOpen;
          this.syncOptions();
        }
        this.openChange.emit(nextOpen);
      },
    };
  }

  syncOptions() {
    this.dialog.setOptions(this.createOptions());
  }

  ngOnChanges() {
    this.syncOptions();
  }

  ngOnDestroy() {
    this.dialog.destroy();
  }
}

@Directive({
  selector: "button[fexDialogTrigger]",
  standalone: true,
  host: {
    type: "button",
    "[attr.aria-haspopup]": "'dialog'",
    "[attr.aria-expanded]": "dialogRoot.snapshot().open",
    "[attr.aria-controls]": "dialogRoot.snapshot().open ? dialogRoot.contentId : null",
    "[attr.data-state]": "dialogRoot.snapshot().open ? 'open' : 'closed'",
  },
})
export class DialogTrigger implements AfterViewInit {
  protected readonly dialogRoot = inject(Dialog);
  private readonly elementRef = inject<ElementRef<HTMLButtonElement>>(ElementRef);

  ngAfterViewInit() {
    this.dialogRoot.triggerElement = this.elementRef.nativeElement;
  }

  @HostListener("click", ["$event"])
  click(event: MouseEvent) {
    this.dialogRoot.syncOptions();
    this.dialogRoot.dialog.toggle({ reason: "trigger-click", event });
  }
}

@Component({
  selector: "fex-dialog-portal",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: "<ng-content />",
})
export class DialogPortal {}

@Component({
  selector: "fex-dialog-overlay",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "data-slot": "dialog-overlay",
    "[class]": "hostClassName()",
    "[style.display]": "dialogRoot.snapshot().mounted ? null : 'none'",
    "[attr.data-state]": "dialogRoot.snapshot().open ? 'open' : 'closed'",
    "[attr.data-phase]": "dialogRoot.snapshot().phase",
  },
  template: "",
})
export class DialogOverlay implements AfterViewInit, OnDestroy {
  protected readonly dialogRoot = inject(Dialog);
  private readonly elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);
  protected readonly hostClassName = createHostClassName(dialogOverlayClassName);

  ngAfterViewInit() {
    this.dialogRoot.dialog.setOverlayElement(this.elementRef.nativeElement);
  }

  ngOnDestroy() {
    this.dialogRoot.dialog.setOverlayElement(null);
  }

  @HostListener("click", ["$event"])
  click(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.dialogRoot.dialog.dismiss.overlayPointer({
        target: event.target,
        currentTarget: event.currentTarget,
        event,
      });
    }
  }
}

@Component({
  selector: "fex-dialog-content",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: "dialog",
    tabindex: "-1",
    "data-slot": "dialog-content",
    "[id]": "dialogRoot.contentId",
    "[attr.aria-modal]": "'true'",
    "[attr.aria-labelledby]": "dialogRoot.titleId",
    "[attr.aria-describedby]": "dialogRoot.descriptionId",
    "[class]": "hostClassName()",
    "[style.display]": "dialogRoot.snapshot().mounted ? null : 'none'",
    "[attr.data-state]": "dialogRoot.snapshot().open ? 'open' : 'closed'",
    "[attr.data-phase]": "dialogRoot.snapshot().phase",
  },
  template: "<ng-content />",
})
export class DialogContent implements AfterViewInit, OnDestroy {
  @Input() size: DialogStyleProps["size"] = "md";
  protected readonly dialogRoot = inject(Dialog);
  private readonly elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);
  protected readonly hostClassName = createHostClassName(() => dialogContentClassName({ size: this.size }));

  ngAfterViewInit() {
    this.dialogRoot.dialog.setLayerElement(this.elementRef.nativeElement);
  }

  ngOnDestroy() {
    this.dialogRoot.dialog.setLayerElement(null);
  }

  @HostListener("keydown", ["$event"])
  keydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.dialogRoot.dialog.dismiss.escapeKey({
        target: event.target,
        currentTarget: event.currentTarget,
        event,
      });
    }
  }
}

@Component({
  selector: "fex-dialog-header",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[class]": "hostClassName()", "data-slot": "dialog-header" },
  template: "<ng-content />",
})
export class DialogHeader {
  protected readonly hostClassName = createHostClassName(dialogHeaderClassName);
}

@Component({
  selector: "fex-dialog-title",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[id]": "dialogRoot.titleId", "[class]": "hostClassName()", "data-slot": "dialog-title" },
  template: "<ng-content />",
})
export class DialogTitle {
  protected readonly dialogRoot = inject(Dialog);
  protected readonly hostClassName = createHostClassName(dialogTitleClassName);
}

@Component({
  selector: "fex-dialog-description",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[id]": "dialogRoot.descriptionId", "[class]": "hostClassName()", "data-slot": "dialog-description" },
  template: "<ng-content />",
})
export class DialogDescription {
  protected readonly dialogRoot = inject(Dialog);
  protected readonly hostClassName = createHostClassName(dialogDescriptionClassName);
}

@Component({
  selector: "fex-dialog-body",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[class]": "hostClassName()", "data-slot": "dialog-body" },
  template: "<ng-content />",
})
export class DialogBody {
  protected readonly hostClassName = createHostClassName(dialogBodyClassName);
}

@Component({
  selector: "fex-dialog-footer",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[class]": "hostClassName()", "data-slot": "dialog-footer" },
  template: "<ng-content />",
})
export class DialogFooter {
  protected readonly hostClassName = createHostClassName(dialogFooterClassName);
}

@Directive({
  selector: "button[fexDialogClose]",
  standalone: true,
  host: {
    type: "button",
    "data-slot": "dialog-close",
  },
})
export class DialogClose {
  protected readonly dialogRoot = inject(Dialog);

  @HostListener("click", ["$event"])
  click(event: MouseEvent) {
    this.dialogRoot.dialog.close({ reason: "manual", source: "close-button", event });
  }
}
