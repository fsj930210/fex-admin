import { kbdClassName, kbdGroupClassName } from "@fex/components-styles/kbd";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { createHostClassName } from "../../signals/host-class";

@Component({
  selector: "kbd[fexKbd]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "kbd",
  },
  template: "<ng-content />",
})
export class Kbd {
  protected readonly hostClassName = createHostClassName(kbdClassName);
}

@Component({
  selector: "fex-kbd-group",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "kbd-group",
  },
  template: "<ng-content />",
})
export class KbdGroup {
  protected readonly hostClassName = createHostClassName(kbdGroupClassName);
}
