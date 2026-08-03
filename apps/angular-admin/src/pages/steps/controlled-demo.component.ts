import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { Steps, type StepValue } from '@fex/components-angular/primitive/steps'
import { Button } from '@fex/components-angular/ui/button'
import { Card } from '@fex/components-angular/ui/card'
import { StepListComponent } from './step-list.component'

@Component({
  selector: 'fex-steps-controlled-demo',
  standalone: true,
  imports: [Card, Button, Steps, StepListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './controlled-demo.component.html',
})
export class ControlledDemoComponent {
  current = signal<StepValue>('account')

  complete() {
    this.current.set(this.current() === 'account' ? 'profile' : 'review')
  }
}
