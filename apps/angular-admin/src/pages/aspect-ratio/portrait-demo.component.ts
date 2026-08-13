import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RatioDemoComponent } from './ratio-demo.component'
@Component({
  selector: 'fex-portrait-demo',
  standalone: true,
  imports: [RatioDemoComponent],
  template:
    '<fex-ratio-demo title="Portrait" description="A 9:16 media container." [ratio]="9 / 16" sizeClass="max-w-48" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortraitDemoComponent {}
