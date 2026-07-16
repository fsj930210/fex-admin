import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "fex-ellipsis-icon",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0' },
  templateUrl: "./more.html",
})
export class EllipsisIcon {}
