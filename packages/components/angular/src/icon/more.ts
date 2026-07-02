import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "fex-ellipsis-icon",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./more.html",
})
export class EllipsisIcon {}
