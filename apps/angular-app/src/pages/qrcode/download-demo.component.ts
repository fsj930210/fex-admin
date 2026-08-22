import { ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core'
import { QrCodeCanvas, QrCodeRoot } from '@fex-design/angular/primitive/qrcode'
import { Button } from '@fex-design/angular/ui/button'
import { Card } from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-qrcode-download-demo',
  standalone: true,
  imports: [Card, Button, QrCodeRoot, QrCodeCanvas],
  templateUrl: './download-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadDemo {
  protected readonly container = viewChild<ElementRef<HTMLElement>>('container')

  protected download() {
    const canvas = this.container()?.nativeElement.querySelector('canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'fex-qrcode.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }
}
