import { stepInputNumber } from '@fex-design/core/input-number/value'
import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { MinusIcon } from '@fex-design/angular/icon/minus'
import { PlusIcon } from '@fex-design/angular/icon/plus'
import { Button } from '@fex-design/angular/ui/button'
import Card from '@fex-design/angular/ui/card'
@Component({
  selector: 'fex-input-number-custom-logic-demo',
  standalone: true,
  imports: [Card, Button, MinusIcon, PlusIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './custom-logic-demo.component.html',
})
export class CustomLogicDemoComponent {
  protected value = signal(5)
  protected step(direction: 'increment' | 'decrement') {
    this.value.set(stepInputNumber(this.value(), direction, { min: 0, max: 10 }))
  }
}
