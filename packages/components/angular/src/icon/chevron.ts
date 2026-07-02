import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "fex-chevron-right-icon",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./chevron-right.html",
})
export class ChevronRightIcon {}

@Component({
  selector: "fex-chevron-left-icon",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./chevron-left.html",
})
export class ChevronLeftIcon {}
