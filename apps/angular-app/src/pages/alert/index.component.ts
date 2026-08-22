import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@fex-design/angular/primitive/alert'
import { Badge } from '@fex-design/angular/primitive/badge'
import Card from '@fex-design/angular/ui/card'
import { InfoIcon } from '@fex-design/angular/icon/info'

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
