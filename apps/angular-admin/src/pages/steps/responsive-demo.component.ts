import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Steps } from '@fex/components-angular/primitive/steps'
import { Card } from '@fex/components-angular/ui/card'
import { StepListComponent } from './step-list.component'

@Component({
  selector: 'fex-steps-responsive-demo',
  standalone: true,
  imports: [Card, Steps, StepListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './responsive-demo.component.html',
})
export class ResponsiveDemoComponent {}
