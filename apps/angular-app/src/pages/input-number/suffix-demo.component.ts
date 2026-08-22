import { ChangeDetectionStrategy, Component } from '@angular/core'
import { InputNumber, InputNumberSuffix } from '@fex-design/angular/primitive/input-number'
import Card from '@fex-design/angular/ui/card'
@Component({
  selector: 'fex-input-number-suffix-demo',
  standalone: true,
  imports: [Card, InputNumber, InputNumberSuffix],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './suffix-demo.component.html',
})
export class SuffixDemoComponent {}
