import { buttonPrimitiveClassName as buttonPrimitiveStyleClassName } from "@fex/components-styles/button";
import { cn } from "@fex/utils";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { createHostClassName } from "../../signals/host-class";

export function buttonPrimitiveClassName(className?: string) {
  return cn(buttonPrimitiveStyleClassName, className);
}

@Component({
  selector: "button[fexButtonPrimitive]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "button",
  },
  template: "<ng-content />",
})
export class Button {
  protected readonly hostClassName = createHostClassName(buttonPrimitiveClassName());
}
