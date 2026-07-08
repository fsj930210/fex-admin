import { createSelectionController } from "@fex/components-core/selection/create-selection-controller";
import type { SelectionChangeMeta, SelectionController, SelectionValue } from "@fex/components-core/selection/types";
import {
  radioButtonClassName,
  radioGroupClassName,
  radioIndicatorClassName,
  radioRootClassName,
  type RadioButtonStyleProps,
  type RadioGroupStyleProps,
  type RadioStyleProps,
} from "@fex/components-styles/radio";
import { cn } from "@fex/utils";
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  input,
  output,
} from "@angular/core";
import { createCoreStoreSignal } from "../../signals/core-store-signal";
import { createHostClassName } from "../../signals/host-class";

export type RadioValue = SelectionValue;

export interface RadioChangeMeta {
  previousValue: RadioValue | undefined;
  value: RadioValue;
  changedValues: SelectionChangeMeta["changedValues"];
}

function toRadioChangeMeta(value: RadioValue, meta: SelectionChangeMeta): RadioChangeMeta {
  return {
    previousValue: meta.previousValues[0],
    value,
    changedValues: meta.changedValues,
  };
}

@Component({
  selector: "div[fexRadioGroup]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: "radiogroup",
    "[class]": "hostClassName()",
    "[attr.data-orientation]": "orientation()",
    "[attr.data-disabled]": "disabled() ? 'true' : null",
  },
  template: "<ng-content />",
})
export class RadioGroup {
  value = input<RadioValue | undefined>();
  defaultValue = input<RadioValue | undefined>();
  disabled = input(false, { transform: booleanAttribute });
  orientation = input<RadioGroupStyleProps["orientation"]>("vertical");
  valueChange = output<{ value: RadioValue; meta: RadioChangeMeta }>();

  readonly controller: SelectionController;
  readonly snapshot;

  protected readonly hostClassName = createHostClassName(() =>
    cn(radioGroupClassName({ orientation: this.orientation() })),
  );

  constructor() {
    const group = this;
    this.controller = createSelectionController({
      get value() {
        return group.value();
      },
      get defaultValue() {
        return group.defaultValue();
      },
      get multiple() {
        return false;
      },
      onChange(values, meta) {
        const nextValue = values[0];
        if (nextValue === undefined) return;
        group.valueChange.emit({ value: nextValue, meta: toRadioChangeMeta(nextValue, meta) });
      },
    });
    this.snapshot = createCoreStoreSignal(this.controller);
  }

  currentValue() {
    return this.value() ?? this.snapshot().value ?? this.defaultValue();
  }

  select(value: RadioValue) {
    if (this.disabled()) return;
    this.controller.replace(value);
  }
}

@Component({
  selector: "button[fexRadio]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    type: "button",
    role: "radio",
    "[class]": "hostClassName()",
    "[disabled]": "disabledState()",
    "[attr.aria-checked]": "checked()",
    "[attr.data-state]": "checked() ? 'checked' : 'unchecked'",
    "[attr.data-disabled]": "disabledState() ? 'true' : null",
    "[attr.data-value]": "value()",
  },
  templateUrl: "./radio.html",
})
export class Radio {
  private readonly group = inject(RadioGroup);

  value = input.required<RadioValue>();
  disabled = input(false, { transform: booleanAttribute });
  size = input<RadioStyleProps["size"]>("default");

  protected readonly checked = computed(() => this.group.currentValue() === this.value());
  protected readonly disabledState = computed(() => this.group.disabled() || this.disabled());
  protected readonly indicatorClassName = computed(() => radioIndicatorClassName({ size: this.size() }));
  protected readonly hostClassName = createHostClassName(() => cn(radioRootClassName({ size: this.size() })));

  @HostListener("click", ["$event"])
  select(event: MouseEvent) {
    if (event.defaultPrevented || this.disabledState()) return;
    this.group.select(this.value());
  }
}

@Component({
  selector: "button[fexRadioButton]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    type: "button",
    role: "radio",
    "[class]": "hostClassName()",
    "[disabled]": "disabledState()",
    "[attr.aria-checked]": "checked()",
    "[attr.data-state]": "checked() ? 'checked' : 'unchecked'",
    "[attr.data-disabled]": "disabledState() ? 'true' : null",
    "[attr.data-value]": "value()",
  },
  templateUrl: "./radio-button.html",
})
export class RadioButton {
  private readonly group = inject(RadioGroup);

  value = input.required<RadioValue>();
  disabled = input(false, { transform: booleanAttribute });
  size = input<RadioButtonStyleProps["size"]>("default");

  protected readonly checked = computed(() => this.group.currentValue() === this.value());
  protected readonly disabledState = computed(() => this.group.disabled() || this.disabled());
  protected readonly hostClassName = createHostClassName(() => cn(radioButtonClassName({ size: this.size() })));

  @HostListener("click", ["$event"])
  select(event: MouseEvent) {
    if (event.defaultPrevented || this.disabledState()) return;
    this.group.select(this.value());
  }
}
