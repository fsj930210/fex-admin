import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({ selector: 'fex-error-icon', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { class: 'contents' }, templateUrl: './error.html' })
export class ErrorIcon {}
