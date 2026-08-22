import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Watermark } from '@fex-design/angular/primitive/watermark'
import Card from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-watermark-basic-demo',
  standalone: true,
  imports: [Card, Watermark],
  templateUrl: './basic-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicDemo {}
