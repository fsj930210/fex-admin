import { ChangeDetectionStrategy, Component } from '@angular/core'
import { InputNumber } from '@fex-design/angular/primitive/input-number'
import Card from '@fex-design/angular/ui/card'
@Component({
  selector: 'fex-input-number-constraints-demo',
  standalone: true,
  imports: [Card, InputNumber],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './constraints-demo.component.html',
})
export class ConstraintsDemoComponent {}
