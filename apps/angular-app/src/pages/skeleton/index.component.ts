import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Skeleton } from '@fex-design/angular/primitive/skeleton'
import { skeletonAnimationClassName } from '@fex-design/styles/skeleton'
import Card from '@fex-design/angular/ui/card'
@Component({
  selector: 'fex-skeleton-page',
  standalone: true,
  imports: [Card, Skeleton],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent {
  protected readonly animationClassName = skeletonAnimationClassName
  protected readonly widths = [40, 60, 50]
}
