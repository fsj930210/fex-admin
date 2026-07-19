import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import type { CarouselController, CarouselSnapshot } from '@fex/components-core/carousel/types'
import { ChevronLeftIcon, ChevronRightIcon } from '@fex/components-angular/icon/chevron'
import { carouselIndicatorClassName, carouselIndicatorsClassName } from '@fex/components-styles/carousel'

@Component({
  selector: 'fex-carousel-controls',
  imports: [ChevronLeftIcon, ChevronRightIcon],
  templateUrl: './carousel-controls.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselControlsComponent {
  readonly controller = input.required<CarouselController>()
  readonly snapshot = input.required<CarouselSnapshot>()
  protected readonly indicatorsClassName = carouselIndicatorsClassName
  protected readonly indicatorClassName = carouselIndicatorClassName
}
