import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  QrCodeBackground,
  QrCodeModules,
  QrCodeOverlay,
  QrCodeRoot,
  QrCodeSvg,
} from '@fex-design/angular/primitive/qrcode'
import { Button } from '@fex-design/angular/ui/button'
import { Card } from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-qrcode-overlay-demo',
  standalone: true,
  imports: [Card, Button, QrCodeRoot, QrCodeSvg, QrCodeBackground, QrCodeModules, QrCodeOverlay],
  templateUrl: './overlay-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayDemo {
  protected readonly expired = signal(true)
}
