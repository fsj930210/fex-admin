import { inputClassName as inputStyleClassName } from "@fex/components-styles/input";
import { Directive } from "@angular/core";
import { createHostClassName } from "../../signals/host-class";

@Directive({
  selector: "input[fexInput]",
  standalone: true,
  host: { "[class]": "hostClassName()", "data-slot": "input" },
})
export class Input {
  protected readonly hostClassName = createHostClassName(inputStyleClassName);
}
