import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({ selector: 'fex-info-icon', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { class: 'contents' }, templateUrl: './info.html' })
export class InfoIcon {}
