import {
  buttonClassName,
  buttonIconClassName,
  buttonSpinnerClassName,
} from "@fex/components-styles/button";
import { buttonPrimitiveClassName } from "@fex/components-angular/primitive/button";
import { cn } from "@fex/utils";
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { LoadingIcon } from "../../icon/loading";
import { createHostClassName } from "../../signals/host-class";

type ButtonVariant =
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "destructive"
  | "link"
  | "dashed";

type ButtonSize = "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";

type ButtonEffect =
  | "expand-icon"
  | "ring-hover"
  | "shine"
  | "shine-hover"
  | "gooey-left"
  | "gooey-right"
  | "underline"
  | "hover-underline"
  | "gradient-slide-show";

@Component({
  selector: "button[fexButton]",
  standalone: true,
  imports: [LoadingIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClassName()",
    "data-slot": "button",
    "[attr.data-variant]": "variant()",
    "[attr.data-size]": "size()",
    "[attr.data-effect]": "effect()",
    "[attr.data-loading]": "loading() ? 'true' : null",
    "[disabled]": "disabledState()",
  },
  templateUrl: "./button.html",
})
export class Button {
  variant = input<ButtonVariant>("default");
  size = input<ButtonSize>("default");
  effect = input<ButtonEffect | undefined>();

  iconPlacement = input<"start" | "end">("start");
  loading = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });

  protected readonly spinnerClassName = buttonSpinnerClassName;

  protected readonly disabledState = computed(() => this.disabled() || this.loading());

  protected readonly hostClassName = createHostClassName(() =>
    cn(
      buttonPrimitiveClassName(),
      buttonClassName({
        variant: this.variant(),
        size: this.size(),
        effect: this.effect(),
      }),
    ),
  );

  protected readonly startIconClassName = computed(() =>
    buttonIconClassName({
      placement: "start",
      effect: this.effect(),
    }),
  );

  protected readonly endIconClassName = computed(() =>
    buttonIconClassName({
      placement: "end",
      effect: this.effect(),
    }),
  );
}
