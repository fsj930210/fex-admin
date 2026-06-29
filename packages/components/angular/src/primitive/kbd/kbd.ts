import { kbdClassName, kbdGroupClassName } from "@fex/components-styles/kbd";
import { cn } from "@fex/utils";
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject } from "@angular/core";

function createClass(className: string) {
  const initial = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.getAttribute("class") ?? "";
  return computed(() => cn(className, initial));
}

@Component({ selector: "kbd[fex-kbd]", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { "[class]": "hostClassName()", "data-slot": "kbd" }, template: "<ng-content />" })
export class Kbd { protected readonly hostClassName = createClass(kbdClassName); }

@Component({ selector: "fex-kbd-group", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { "[class]": "hostClassName()", "data-slot": "kbd-group" }, template: "<ng-content />" })
export class KbdGroup { protected readonly hostClassName = createClass(kbdGroupClassName); }
