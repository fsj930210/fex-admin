import { ChangeDetectionStrategy, Component } from '@angular/core'
import { InputNumber } from '@fex-design/angular/primitive/input-number'
import Card from '@fex-design/angular/ui/card'
@Component({
  selector: 'fex-input-number-states-demo',
  standalone: true,
  imports: [Card, InputNumber],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './states-demo.component.html',
})
export class StatesDemoComponent {}
