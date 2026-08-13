import { separatorClassName } from '@fex-design/styles/separator'
import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core'
import { createHostClassName } from '../../signals/host-class'
@Component({
  selector: 'fex-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()',
    '[attr.role]': 'decorative()?"none":"separator"',
    '[attr.aria-orientation]': 'decorative()?null:orientation()',
    'data-slot': 'separator',
    '[attr.data-orientation]': 'orientation()',
  },
  template: '',
})
export class Separator {
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal')
  readonly decorative = input(true, { transform: booleanAttribute })
  protected readonly hostClassName = createHostClassName(() => separatorClassName)
}
