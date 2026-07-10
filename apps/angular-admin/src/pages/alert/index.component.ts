import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@fex/components-angular/primitive/alert'
import { Badge } from '@fex/components-angular/ui/badge'
import Card from '@fex/components-angular/ui/card'
import { InfoIcon } from '@fex/components-angular/icon/info'

@Component({
  selector: 'fex-alert-page',
  imports: [RouterLink, Card, Alert, AlertAction, AlertDescription, AlertTitle, Badge, InfoIcon],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  protected readonly variants = ['default', 'success', 'warning', 'info', 'destructive'] as const
}
