import { ChangeDetectionStrategy, Component } from "@angular/core";
@Component({ selector: "fex-plus-icon", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { class: "contents" }, templateUrl: "./plus.html" })
export class PlusIcon {}
