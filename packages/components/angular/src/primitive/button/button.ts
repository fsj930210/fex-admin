import { buttonPrimitiveClassName as buttonPrimitiveStyleClassName } from "@fex/components-styles/button";
import { cn } from "@fex/utils";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
} from "@angular/core";

export function buttonPrimitiveClassName(className?: string) {
  return cn(buttonPrimitiveStyleClassName, className);
}

@Component({
  selector: "button[fex-button-primitive]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName",
    "data-slot": "button",
  },
  template: "<ng-content />",
})
export class Button {
  private readonly elementRef = inject<ElementRef<HTMLButtonElement>>(ElementRef);
  protected readonly hostClassName = buttonPrimitiveClassName(this.elementRef.nativeElement.getAttribute("class") ?? "");
}
