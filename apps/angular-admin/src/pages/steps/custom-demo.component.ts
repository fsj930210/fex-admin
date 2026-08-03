import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ErrorIcon } from '@fex/components-angular/icon/error'
import { Step, StepContent, StepIndicator, Steps } from '@fex/components-angular/primitive/steps'
import { Card } from '@fex/components-angular/ui/card'
import { StepListComponent } from './step-list.component'

@Component({
  selector: 'fex-steps-custom-demo',
  standalone: true,
  imports: [Card, Steps, Step, StepContent, StepIndicator, ErrorIcon, StepListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './custom-demo.component.html',
})
export class CustomDemoComponent {}
