import { switchClassName, switchThumbClassName } from "@fex/components-styles/switch";
import { cn } from "@fex/utils";
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { createHostClassName } from "../../signals/host-class";

export type SwitchState = "checked" | "unchecked";
type SwitchSize = "sm" | "default" | "lg";

@Component({
  selector: "button[fexSwitchPrimitive]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    type: "button",
    role: "switch",
    "[disabled]": "disabled()",
    "[attr.aria-checked]": "currentChecked()",
    "[attr.data-state]": "state()",
    "[attr.data-disabled]": "disabled() ? 'true' : null",
    "[class]": "hostClassName()",
    "(click)": "handleClick($event)",
  },
  template: "<ng-content />",
})
export class SwitchRoot {
  checked = input<boolean | undefined>();
  defaultChecked = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });
  size = input<SwitchSize>("default");
  checkedChange = output<{ checked: boolean; event: MouseEvent }>();

  private readonly hasInteracted = signal(false);
  private readonly internalChecked = signal(false);
  readonly currentChecked = computed(() =>
    this.checked() ?? (this.hasInteracted() ? this.internalChecked() : this.defaultChecked()),
  );
  readonly state = computed<SwitchState>(() => (this.currentChecked() ? "checked" : "unchecked"));
  protected readonly hostClassName = createHostClassName(() => cn(switchClassName({ size: this.size() })));

  handleClick(event: MouseEvent) {
    if (event.defaultPrevented || this.disabled()) return;
    const nextChecked = !this.currentChecked();
    if (this.checked() === undefined) {
      this.hasInteracted.set(true);
      this.internalChecked.set(nextChecked);
    }
    this.checkedChange.emit({ checked: nextChecked, event });
  }
}

@Component({
  selector: "span[fexSwitchThumb]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.data-state]": "resolvedState()",
    "[class]": "hostClassName()",
  },
  template: "<ng-content />",
})
export class SwitchThumb {
  private readonly root = inject(SwitchRoot, { optional: true });

  checked = input(false, { transform: booleanAttribute });
  state = input<SwitchState | undefined>();
  size = input<SwitchSize>("default");

  protected readonly resolvedState = computed<SwitchState>(() => this.state() ?? this.root?.state() ?? (this.checked() ? "checked" : "unchecked"));
  protected readonly hostClassName = createHostClassName(() => cn(switchThumbClassName({ size: this.size() })));
}
