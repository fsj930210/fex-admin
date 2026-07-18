import { buttonPrimitiveClassName as buttonPrimitiveStyleClassName } from "@fex/components-styles/button";
import { cn } from "@fex/utils";
import { Directive } from "@angular/core";
import { createHostClassName } from "../../signals/host-class";

export function buttonPrimitiveClassName(className?: string) {
  return cn(buttonPrimitiveStyleClassName, className);
}

@Directive({
  selector: "button[fexButtonPrimitive]",
  standalone: true,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "button",
    "type": "button",
  },
})
export class Button {
  protected readonly hostClassName = createHostClassName(buttonPrimitiveClassName());
}
