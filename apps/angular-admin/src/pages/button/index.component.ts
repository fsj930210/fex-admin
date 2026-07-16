import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Button as PrimitiveButton } from '@fex/components-angular/primitive/button'
import { Button } from '@fex/components-angular/ui/button'
import Card from '@fex/components-angular/ui/card'
import { PlusIcon } from '@fex/components-angular/icon/plus'

@Component({
  selector: 'fexButton-page',
  imports: [PrimitiveButton, Button, Card, RouterLink, PlusIcon],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  protected variants = [
    'default',
    'outline',
    'secondary',
    'ghost',
    'destructive',
    'link',
    'dashed',
  ] as const
  protected sizes = ['xs', 'sm', 'default', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'] as const
  protected effects = [
    'expand-icon',
    'ring-hover',
    'shine',
    'shine-hover',
    'gooey-left',
    'gooey-right',
    'gradient-slide-show',
  ] as const
}
