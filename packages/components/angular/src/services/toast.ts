import { createToastManager, type ToastItem, type ToastManager } from "@fex/components-core/toast/create-toast-manager";
import { computed, Injectable } from "@angular/core";
import { createCoreStoreSignal } from "../signals/core-store-signal";

export type AngularToastContent = unknown;
export type AngularToastItem = ToastItem<AngularToastContent>;
export type AngularToastManager = ToastManager<AngularToastContent>;

@Injectable({ providedIn: "root" })
export class ToastService {
  readonly manager = createToastManager<AngularToastContent>();
  readonly snapshot = createCoreStoreSignal(this.manager);
  readonly items = computed(() => this.snapshot().items);

  show = this.manager.show;
  success = this.manager.success;
  info = this.manager.info;
  warning = this.manager.warning;
  error = this.manager.error;
  loading = this.manager.loading;
  dismiss = this.manager.dismiss;
  destroy = this.manager.destroy;
  clear = this.manager.clear;
  pause = this.manager.pause;
  resume = this.manager.resume;
  configure = this.manager.configure;
}
