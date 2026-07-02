import { alertActionClassName, alertClassName, alertDescriptionClassName, alertTitleClassName, type AlertStyleProps } from "@fex/components-styles/alert";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { createHostClassName } from "../../signals/host-class";

@Component({
  selector: "fex-alert",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[class]": "hostClassName()", "data-slot": "alert", "role": "alert" },
  template: "<ng-content />",
})
export class Alert {
  readonly variant = input<AlertStyleProps["variant"]>("default");
  protected readonly hostClassName = createHostClassName(() => alertClassName({ variant: this.variant() }));
}

@Component({
  selector: "fex-alert-title",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "alert-title",
  },
  template: "<ng-content />",
})
export class AlertTitle {
  protected readonly hostClassName = createHostClassName(alertTitleClassName);
}

@Component({
  selector: "fex-alert-description",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "alert-description",
  },
  template: "<ng-content />",
})
export class AlertDescription {
  protected readonly hostClassName = createHostClassName(alertDescriptionClassName);
}

@Component({
  selector: "fex-alert-action",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "alert-action",
  },
  template: "<ng-content />",
})
export class AlertAction {
  protected readonly hostClassName = createHostClassName(alertActionClassName);
}
