import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RatioDemoComponent } from './ratio-demo.component'
@Component({
  selector: 'fex-square-demo',
  standalone: true,
  imports: [RatioDemoComponent],
  template:
    '<fex-ratio-demo title="Square" description="A square media container." [ratio]="1" sizeClass="max-w-64" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SquareDemoComponent {}
