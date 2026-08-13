import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { AspectRatio } from '@fex-design/angular/primitive/aspect-ratio'
import Card from '@fex-design/angular/ui/card'
@Component({
  selector: 'fex-ratio-demo',
  standalone: true,
  imports: [Card, AspectRatio],
  templateUrl: './ratio-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatioDemoComponent {
  readonly title = input.required<string>()
  readonly description = input.required<string>()
  readonly ratio = input.required<number>()
  readonly sizeClass = input.required<string>()
}
