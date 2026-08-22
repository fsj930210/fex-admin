import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { Steps, type StepValue } from '@fex-design/angular/primitive/steps'
import { Card } from '@fex-design/angular/ui/card'
import { StepListComponent } from './step-list.component'

@Component({
  selector: 'fex-steps-disabled-demo',
  standalone: true,
  imports: [Card, Steps, StepListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './disabled-demo.component.html',
})
export class DisabledDemoComponent {
  value = signal<StepValue>('account')
}
