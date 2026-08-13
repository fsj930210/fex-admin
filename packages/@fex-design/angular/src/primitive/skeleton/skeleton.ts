import { skeletonClassName } from '@fex-design/styles/skeleton'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { createHostClassName } from '../../signals/host-class'
@Component({
  selector: 'fex-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClassName()', 'aria-hidden': 'true', 'data-slot': 'skeleton' },
  template: '',
})
export class Skeleton {
  protected readonly hostClassName = createHostClassName(() => skeletonClassName)
}
