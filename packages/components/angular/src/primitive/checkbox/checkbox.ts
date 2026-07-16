import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from "@angular/core";

type CheckboxCheckedState = boolean | "indeterminate";
interface CheckboxChangeMeta {
  previousChecked: CheckboxCheckedState;
  checked: CheckboxCheckedState;
}

@Component({
  selector: "button[fexCheckboxPrimitive]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    type: "button",
    role: "checkbox",
    "[disabled]": "disabled()",
    "[attr.aria-checked]": "ariaChecked()",
    "[attr.data-state]": "state()",
    "[attr.data-disabled]": "disabled() ? 'true' : null",
    "(click)": "handleClick($event)",
  },
  template: "<ng-content />",
})
export class CheckboxRoot {
  checked = input<CheckboxCheckedState | undefined>();
  defaultChecked = input<CheckboxCheckedState | undefined>();
  disabled = input(false, { transform: booleanAttribute });
  checkedChange = output<{ checked: CheckboxCheckedState; meta: CheckboxChangeMeta }>();

  private readonly hasInteracted = signal(false);
  private readonly internalChecked = signal<CheckboxCheckedState>(false);
  protected readonly currentChecked = computed(() =>
    this.checked() ?? (this.hasInteracted() ? this.internalChecked() : this.defaultChecked() ?? false),
  );
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
  selector: "span[fexCheckboxIndicator]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.data-state]": "state()",
  },
  template: "<ng-content />",
})
export class CheckboxIndicator {
  checked = input<CheckboxCheckedState>(false);

  protected readonly state = computed(() =>
    this.checked() === "indeterminate" ? "indeterminate" : this.checked() ? "checked" : "unchecked",
  );
}

@Component({
  selector: "div[fexCheckboxGroupPrimitive]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: "<ng-content />",
})
export class CheckboxGroup {}
