import { buttonGroupClassName, buttonPrimitiveClassName as buttonPrimitiveStyleClassName } from '@fex-design/styles/button'
import { cn } from '@fex/utils'
import { ChangeDetectionStrategy, Component, Directive, input } from '@angular/core'
import { createHostClassName } from '../../signals/host-class'

export function buttonPrimitiveClassName(className?: string) {
  return cn(buttonPrimitiveStyleClassName, className)
}

@Directive({
  selector: 'button[fexButtonPrimitive]',
  standalone: true,
  host: {
    '[class]': 'hostClassName()',
    'data-slot': 'button',
    type: 'button',
  },
})
export class Button {
  protected readonly hostClassName = createHostClassName(buttonPrimitiveClassName())
}

@Component({
  selector: 'fex-button-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()',
    '[attr.data-orientation]': 'orientation()',
    '[style.gap]': 'gap()',
    role: 'group',
    'data-slot': 'button-group',
  },
  template: '<ng-content />',
})
export class ButtonGroup {
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal')
  readonly spacing = input<number | string>(0)
  protected readonly gap = () => typeof this.spacing() === 'number' ? `${this.spacing()}px` : this.spacing()
  protected readonly hostClassName = createHostClassName(() => buttonGroupClassName({ orientation: this.orientation(), connected: this.spacing() === 0 }))
}
