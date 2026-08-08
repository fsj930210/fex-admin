import { ChangeDetectionStrategy, Component } from '@angular/core'
import { QrCodeCanvas, QrCodeRoot } from '@fex-design/angular/primitive/qrcode'
import { Card } from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-qrcode-canvas-demo',
  standalone: true,
  imports: [Card, QrCodeRoot, QrCodeCanvas],
  templateUrl: './canvas-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasDemo {}
