import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Watermark } from '@fex-design/angular/primitive/watermark'
import Card from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-watermark-multiline-demo',
  standalone: true,
  imports: [Card, Watermark],
  templateUrl: './multiline-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultilineDemo {
  protected readonly content = ['FEX Admin', 'Confidential']
}
