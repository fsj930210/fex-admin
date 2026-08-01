import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { Rate } from '@fex/components-angular/primitive/rate'
import Card from '@fex/components-angular/ui/card'

@Component({
  selector: 'fex-rate-integer-demo',
  standalone: true,
  imports: [Card, Rate],
  templateUrl: './integer-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegerDemoComponent {
  protected readonly value = signal(3)
}
