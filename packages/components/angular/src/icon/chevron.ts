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

@Component({
  selector: "fex-chevron-down-icon",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./chevron-down.html",
})
export class ChevronDownIcon {}

@Component({
  selector: "fex-chevron-up-icon",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./chevron-up.html",
})
export class ChevronUpIcon {}
