import { alertActionClassName, alertClassName, alertDescriptionClassName, alertTitleClassName, type AlertStyleProps } from "@fex/components-styles/alert";
import { cn } from "@fex/utils";
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input } from "@angular/core";

function initialClassName() {
  return inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.getAttribute("class") ?? "";
}

@Component({
  selector: "fex-alert",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[class]": "hostClassName()", "data-slot": "alert", "role": "alert" },
  template: "<ng-content />",
})
export class Alert {
  readonly variant = input<AlertStyleProps["variant"]>("default");
  private readonly initialClassName = initialClassName();
  protected readonly hostClassName = computed(() => cn(alertClassName({ variant: this.variant() }), this.initialClassName));
}

function createClass(className: string) {
  const initial = initialClassName();
  return computed(() => cn(className, initial));
}

@Component({ selector: "fex-alert-title", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { "[class]": "hostClassName()", "data-slot": "alert-title" }, template: "<ng-content />" })
export class AlertTitle { protected readonly hostClassName = createClass(alertTitleClassName); }

@Component({ selector: "fex-alert-description", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { "[class]": "hostClassName()", "data-slot": "alert-description" }, template: "<ng-content />" })
export class AlertDescription { protected readonly hostClassName = createClass(alertDescriptionClassName); }

@Component({ selector: "fex-alert-action", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { "[class]": "hostClassName()", "data-slot": "alert-action" }, template: "<ng-content />" })
export class AlertAction { protected readonly hostClassName = createClass(alertActionClassName); }
