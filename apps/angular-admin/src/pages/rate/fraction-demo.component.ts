import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { Rate } from '@fex/components-angular/primitive/rate'
import Card from '@fex/components-angular/ui/card'

@Component({
  selector: 'fex-rate-fraction-demo',
  standalone: true,
  imports: [Card, Rate],
  templateUrl: './fraction-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FractionDemoComponent {
  protected readonly value = signal(4.3)
  protected readonly previewValue = signal<number | null>(null)
  protected readonly getValueText = (value: number, count: number) =>
    `${value} points out of ${count}`
  protected displayValue() {
    return (this.previewValue() ?? this.value()).toFixed(1)
  }
}
