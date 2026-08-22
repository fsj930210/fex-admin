import { ChangeDetectionStrategy, Component } from '@angular/core'
import { InputNumber, type InputNumberChange } from '@fex-design/angular/primitive/input-number'
import Card from '@fex-design/angular/ui/card'
@Component({
  selector: 'fex-input-number-basic-demo',
  standalone: true,
  imports: [Card, InputNumber],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './basic-demo.component.html',
})
export class BasicDemoComponent {
  protected value: number | undefined
  protected change(change: InputNumberChange) {
    this.value = change.value
  }
}
