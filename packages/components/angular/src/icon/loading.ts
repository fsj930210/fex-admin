import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "fex-loading-icon",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./loading.html",
})
export class LoadingIcon {}
