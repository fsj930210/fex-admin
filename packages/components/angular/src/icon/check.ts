import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "fex-check-icon",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "contents" },
  templateUrl: "./check.html",
})
export class CheckIcon {}
