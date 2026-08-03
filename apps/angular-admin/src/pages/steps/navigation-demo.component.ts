import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { Steps, type StepsChangeMeta, type StepValue } from '@fex/components-angular/primitive/steps'
import { Card } from '@fex/components-angular/ui/card'
import { StepListComponent } from './step-list.component'

@Component({
  selector: 'fex-steps-navigation-demo',
  standalone: true,
  imports: [Card, Steps, StepListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './navigation-demo.component.html',
})
export class NavigationDemoComponent {
  message = signal('Use click, Enter, Space or arrow keys.')

  change(event: { value: StepValue; meta: StepsChangeMeta }) {
    this.message.set(`${String(event.meta.previous?.value ?? 'none')} -> ${String(event.value)} (${event.meta.trigger})`)
  }
}
