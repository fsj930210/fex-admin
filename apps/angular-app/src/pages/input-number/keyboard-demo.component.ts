import { ChangeDetectionStrategy, Component } from '@angular/core'
import { InputNumber, type InputNumberChange } from '@fex-design/angular/primitive/input-number'
import Card from '@fex-design/angular/ui/card'
@Component({
  selector: 'fex-input-number-keyboard-demo',
  standalone: true,
  imports: [Card, InputNumber],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './keyboard-demo.component.html',
})
export class KeyboardDemoComponent {
  protected message = 'Use ArrowUp, ArrowDown or buttons.'
  protected change(change: InputNumberChange) {
    this.message = `${change.event.type}: ${change.value ?? 'empty'}`
  }
}
