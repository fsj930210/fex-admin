import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  QrCodeBackground,
  QrCodeCenter,
  QrCodeModules,
  QrCodeRoot,
  QrCodeSvg,
} from '@fex-design/angular/primitive/qrcode'
import { Card } from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-qrcode-advanced-demo',
  standalone: true,
  imports: [Card, QrCodeRoot, QrCodeSvg, QrCodeBackground, QrCodeModules, QrCodeCenter],
  templateUrl: './advanced-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedDemo {}
