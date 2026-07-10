import { toastActionClassName, toastCloseClassName, toastDescriptionClassName, toastIconClassName, toastRootClassName, toastStackContainerClassName, toastStackItemsClassName, toastStackLayerClassName, toastTitleClassName, toastViewportClassName } from "@fex/components-styles/toast";
import type { ToastPlacement, ToastStyleProps } from "@fex/components-styles/toast";
import { ChangeDetectionStrategy, Component, booleanAttribute, computed, inject, input } from "@angular/core";
import { createHostClassName } from "../../signals/host-class";
import { ToastService, type AngularToastItem } from "../../services/toast";

export { ToastService } from "../../services/toast";
export type { AngularToastContent, AngularToastItem, AngularToastManager } from "../../services/toast";

@Component({
  selector: "fex-toast-viewport",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "[style.--toast-offset]": "offsetStyle()",
    "data-slot": "toast-viewport",
  },
  templateUrl: "./toast-viewport.html",
})
export class ToastViewport {
  readonly toast = inject(ToastService);
  readonly placement = input<ToastPlacement>("top");
  readonly offset = input<number | string>(24);
  readonly stack = input(false, { transform: booleanAttribute });
  readonly stackThreshold = input(3);
  readonly items = input<AngularToastItem[]>([]);
  protected readonly hostClassName = createHostClassName(() => toastViewportClassName({ placement: this.placement() }));
  protected readonly offsetStyle = computed(() => typeof this.offset() === "number" ? `${this.offset()}px` : this.offset());
  protected readonly stacked = computed(() => this.stack() && this.items().length > this.stackThreshold());
  protected readonly stackContainerClassName = computed(() => toastStackContainerClassName({ placement: this.placement() }));
  protected readonly stackItemsClassName = computed(() => toastStackItemsClassName({ placement: this.placement() }));
  protected readonly stackLayerClassName = toastStackLayerClassName;
}

@Component({
  selector: "fex-toast-root",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "(pointerenter)": "toast.pause(item().id)",
    "(pointerleave)": "toast.resume(item().id)",
    "[attr.data-paused]": "item().paused ? '' : null",
    "[attr.data-variant]": "item().variant",
    "[class]": "hostClassName()",
    "data-slot": "toast",
    "role": "status",
  },
  template: "<ng-content />",
})
export class ToastRoot {
  readonly item = input.required<AngularToastItem>();
  protected readonly hostClassName = createHostClassName(() => {
    const item = this.item();
    const variant = knownVariant(item.variant);
    return toastRootClassName({
      variant,
    });
  });

  constructor(readonly toast: ToastService) {}
}

@Component({
  selector: "fex-toast-icon",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[class]": "hostClassName()", "data-slot": "toast-icon" },
  template: "<ng-content />",
})
export class ToastIcon {
  protected readonly hostClassName = createHostClassName(toastIconClassName);
}

@Component({
  selector: "fex-toast-title",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[class]": "hostClassName()", "data-slot": "toast-title" },
  template: "<ng-content />",
})
export class ToastTitle {
  protected readonly hostClassName = createHostClassName(toastTitleClassName);
}

@Component({
  selector: "fex-toast-description",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[class]": "hostClassName()", "data-slot": "toast-description" },
  template: "<ng-content />",
})
export class ToastDescription {
  protected readonly hostClassName = createHostClassName(toastDescriptionClassName);
}

@Component({
  selector: "fex-toast-action",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[class]": "hostClassName()", "data-slot": "toast-action" },
  template: "<ng-content />",
})
export class ToastAction {
  protected readonly hostClassName = createHostClassName(toastActionClassName);
}

@Component({
  selector: "button[fexToastClose]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "(click)": "toast.dismiss(item().id)",
    "[class]": "hostClassName()",
    "aria-label": "Close toast",
    "data-slot": "toast-close",
    "type": "button",
  },
  template: "<ng-content />",
})
export class ToastClose {
  readonly item = input.required<AngularToastItem>();
  protected readonly hostClassName = createHostClassName(toastCloseClassName);

  constructor(readonly toast: ToastService) {}
}

function knownVariant(variant: AngularToastItem["variant"]): NonNullable<ToastStyleProps["variant"]> {
  return variant === "default" || variant === "success" || variant === "info" || variant === "warning" || variant === "error" || variant === "loading" ? variant : "default";
}
