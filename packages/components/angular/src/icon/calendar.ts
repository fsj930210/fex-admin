import { ChangeDetectionStrategy, Component } from '@angular/core'
@Component({ selector: 'fex-calendar-icon', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, host: { class: 'contents' }, templateUrl: './calendar.html' })
export class CalendarIcon {}
