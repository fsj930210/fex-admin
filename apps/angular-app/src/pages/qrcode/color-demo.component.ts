import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  QrCodeBackground,
  QrCodeModules,
  QrCodeRoot,
  QrCodeSvg,
} from '@fex-design/angular/primitive/qrcode'
import { Card } from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-qrcode-color-demo',
  standalone: true,
  imports: [Card, QrCodeRoot, QrCodeSvg, QrCodeBackground, QrCodeModules],
  templateUrl: './color-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorDemo {}
