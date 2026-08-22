import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Watermark } from '@fex-design/angular/primitive/watermark'
import { Button } from '@fex-design/angular/ui/button'
import Card from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-watermark-restore-demo',
  standalone: true,
  imports: [Button, Card, Watermark],
  templateUrl: './restore-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestoreDemo {
  protected removeWatermark() {
    document.querySelector('[data-demo="angular-watermark-restore"] [data-slot="watermark"]')?.remove()
  }
}
