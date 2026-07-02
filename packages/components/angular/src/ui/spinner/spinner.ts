import { spinnerClassName, type SpinnerStyleProps } from "@fex/components-styles/spinner";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { createHostClassName } from "../../signals/host-class";
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
  protected readonly hostClassName = createHostClassName(() => spinnerClassName({ size: this.size() }));
}
