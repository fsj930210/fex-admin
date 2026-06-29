import { inputClassName as inputStyleClassName } from "@fex/components-styles/input";
import { cn } from "@fex/utils";
import { Directive, ElementRef, inject } from "@angular/core";

@Directive({
  selector: "input[fex-input]",
  standalone: true,
  host: { "[class]": "hostClassName", "data-slot": "input" },
})
export class Input {
  private readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
  protected readonly hostClassName = cn(inputStyleClassName, this.elementRef.nativeElement.getAttribute("class") ?? "");
}
