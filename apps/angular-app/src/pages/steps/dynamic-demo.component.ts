import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { Step, StepContent, StepIndicator, Steps } from '@fex-design/angular/primitive/steps'
import { Button } from '@fex-design/angular/ui/button'
import { Card } from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-steps-dynamic-demo',
  standalone: true,
  imports: [Card, Button, Steps, Step, StepContent, StepIndicator],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './dynamic-demo.component.html',
})
export class DynamicDemoComponent {
  extra = signal(false)
}
