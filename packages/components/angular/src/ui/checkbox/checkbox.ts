import {
  checkboxClassName,
  checkboxGroupClassName,
  checkboxIndicatorClassName,
} from "@fex/components-styles/checkbox";
import { cn } from "@fex/utils";
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from "@angular/core";
import { CheckboxIndicator } from "../../primitive/checkbox/checkbox";
import { CheckIcon } from "../../icon/check";
import { MinusIcon } from "../../icon/minus";
import { createHostClassName } from "../../signals/host-class";

type CheckboxSize = "sm" | "default" | "lg";
type CheckboxOrientation = "horizontal" | "vertical";
type CheckboxCheckedState = boolean | "indeterminate";
interface CheckboxChangeMeta {
  previousChecked: CheckboxCheckedState;
  checked: CheckboxCheckedState;
}

@Component({
  selector: "button[fexCheckbox]",
  standalone: true,
  imports: [CheckboxIndicator, CheckIcon, MinusIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    type: "button",
    role: "checkbox",
    "[class]": "hostClassName()",
    "[disabled]": "disabled()",
    "[attr.aria-checked]": "ariaChecked()",
    "[attr.data-state]": "state()",
    "[attr.data-disabled]": "disabled() ? 'true' : null",
    "data-slot": "checkbox",
    "(click)": "handleClick($event)",
  },
  templateUrl: "./checkbox.html",
})
export class Checkbox {
  size = input<CheckboxSize>("default");
  checked = input<CheckboxCheckedState | undefined>();
  defaultChecked = input<CheckboxCheckedState | undefined>();
  disabled = input(false, { transform: booleanAttribute });
  checkedChange = output<{ checked: CheckboxCheckedState; meta: CheckboxChangeMeta }>();

  private readonly hasInteracted = signal(false);
  private readonly internalChecked = signal<CheckboxCheckedState>(false);
  protected readonly currentChecked = computed(() =>
    this.checked() ?? (this.hasInteracted() ? this.internalChecked() : this.defaultChecked() ?? false),
  );

  protected readonly indicatorClassName = checkboxIndicatorClassName;
  protected readonly state = computed(() =>
    this.currentChecked() === "indeterminate"
      ? "indeterminate"
      : this.currentChecked()
        ? "checked"
        : "unchecked",
  );
  protected readonly ariaChecked = computed(() =>
    this.currentChecked() === "indeterminate" ? "mixed" : this.currentChecked(),
  );
  protected readonly hostClassName = createHostClassName(() =>
    cn(checkboxClassName({ size: this.size() })),
  );

  handleClick(event: MouseEvent) {
    if (event.defaultPrevented) return;
    if (this.disabled()) return;
    const previousChecked = this.currentChecked();
    const nextChecked = previousChecked !== true;
    const meta = { previousChecked, checked: nextChecked };
    if (this.checked() === undefined) {
      this.hasInteracted.set(true);
      this.internalChecked.set(nextChecked);
    }
    this.checkedChange.emit({ checked: nextChecked, meta });
  }
}

@Component({
  selector: "div[fexCheckboxGroup]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "checkbox-group",
    "[attr.data-orientation]": "orientation()",
  },
  template: "<ng-content />",
})
export class CheckboxGroupUi {
  orientation = input<CheckboxOrientation>("vertical");
  protected readonly hostClassName = computed(() =>
    checkboxGroupClassName({ orientation: this.orientation() }),
  );
}
