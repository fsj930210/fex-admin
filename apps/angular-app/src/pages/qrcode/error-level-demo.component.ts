import { ChangeDetectionStrategy, Component } from '@angular/core'
import type { QrCodeErrorLevel } from '@fex-design/core/qrcode'
import {
  QrCodeBackground,
  QrCodeModules,
  QrCodeRoot,
  QrCodeSvg,
} from '@fex-design/angular/primitive/qrcode'
import { Card } from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-qrcode-error-level-demo',
  standalone: true,
  imports: [Card, QrCodeRoot, QrCodeSvg, QrCodeBackground, QrCodeModules],
  templateUrl: './error-level-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorLevelDemo {
  protected readonly levels: QrCodeErrorLevel[] = ['L', 'M', 'Q', 'H']
}
