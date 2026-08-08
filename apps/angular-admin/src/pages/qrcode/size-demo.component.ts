import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  QrCodeBackground,
  QrCodeModules,
  QrCodeRoot,
  QrCodeSvg,
} from '@fex-design/angular/primitive/qrcode'
import { Card } from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-qrcode-size-demo',
  standalone: true,
  imports: [Card, QrCodeRoot, QrCodeSvg, QrCodeBackground, QrCodeModules],
  templateUrl: './size-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SizeDemo {
  protected readonly sizes = [96, 128, 176]
}
