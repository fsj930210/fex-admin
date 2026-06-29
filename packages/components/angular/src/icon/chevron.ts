import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "fex-chevron-right-icon",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg>',
})
export class ChevronRightIcon {}

@Component({
  selector: "fex-chevron-left-icon",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<svg class="rotate-180" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg>',
})
export class ChevronLeftIcon {}
