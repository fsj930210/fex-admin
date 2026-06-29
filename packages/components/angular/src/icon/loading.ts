import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "fex-loading-icon",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<svg class="size-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>',
})
export class LoadingIcon {}
