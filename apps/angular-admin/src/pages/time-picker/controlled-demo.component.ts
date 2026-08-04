import type { TimeValue } from '@fex-design/angular/primitive/time-picker'
import Card from '@fex-design/angular/ui/card'
import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { DemoTimePickerComponent } from './demo-time-picker.component'
@Component({
  selector: 'fex-controlled-time-demo',
  standalone: true,
  imports: [Card, DemoTimePickerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './controlled-demo.component.html',
})
export class ControlledDemoComponent {
  value = signal<TimeValue | null>({ hour: 10, minute: 20, second: 30 })
}
