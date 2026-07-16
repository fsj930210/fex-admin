import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack,
} from '@fex/components-angular/primitive/slider'
import Card from '@fex/components-angular/ui/card'

@Component({
  selector: 'fex-slider-page',
  standalone: true,
  imports: [RouterLink, Card, SliderRoot, SliderTrack, SliderRange, SliderThumb],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent {
  protected readonly basicValue = signal([32])
  protected readonly controlledValue = signal([48])
  protected readonly rangeValue = signal([20, 80])
  protected readonly multipleValue = signal([15, 45, 75])
}
