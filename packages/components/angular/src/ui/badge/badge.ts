import { badgeClassName, type BadgeStyleProps } from "@fex/components-styles/badge";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { createHostClassName } from "../../signals/host-class";

@Component({
  selector: "fex-badge",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[class]": "hostClassName()", "data-slot": "badge", "[attr.data-variant]": "variant()" },
  template: "<ng-content />",
})
export class Badge {
  readonly variant = input<BadgeStyleProps["variant"]>("default");
  protected readonly hostClassName = createHostClassName(() => badgeClassName({ variant: this.variant() }));
}
