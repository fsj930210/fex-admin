import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RatioDemoComponent } from './ratio-demo.component'
@Component({
  selector: 'fex-landscape-demo',
  standalone: true,
  imports: [RatioDemoComponent],
  template:
    '<fex-ratio-demo title="Landscape" description="A 16:9 media container." [ratio]="16 / 9" sizeClass="max-w-2xl" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandscapeDemoComponent {}
