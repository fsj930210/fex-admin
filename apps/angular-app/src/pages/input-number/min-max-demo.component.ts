import { ChangeDetectionStrategy, Component } from '@angular/core'
import { InputNumber } from '@fex-design/angular/primitive/input-number'
import Card from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-input-number-min-max-demo',
  standalone: true,
  imports: [Card, InputNumber],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './min-max-demo.component.html',
})
export class MinMaxDemoComponent {}
