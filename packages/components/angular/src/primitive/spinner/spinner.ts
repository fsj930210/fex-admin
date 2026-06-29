import { spinnerClassName, type SpinnerStyleProps } from "@fex/components-styles/spinner";
import { cn } from "@fex/utils";
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input } from "@angular/core";
import { LoadingIcon } from "../../icon/loading";

@Component({
  selector: "fex-spinner",
  standalone: true,
  imports: [LoadingIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[class]": "hostClassName()", "data-slot": "spinner" },
  template: "<fex-loading-icon />",
})
export class Spinner {
  readonly size = input<SpinnerStyleProps["size"]>("md");
  private readonly initialClassName = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.getAttribute("class") ?? "";
  protected readonly hostClassName = computed(() => cn(spinnerClassName({ size: this.size() }), this.initialClassName));
}
