import { ChangeDetectionStrategy, Component } from '@angular/core'
import { LandscapeDemoComponent } from './landscape-demo.component'
import { PortraitDemoComponent } from './portrait-demo.component'
import { SquareDemoComponent } from './square-demo.component'
@Component({
  selector: 'fex-aspect-ratio-page',
  standalone: true,
  imports: [LandscapeDemoComponent, SquareDemoComponent, PortraitDemoComponent],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AspectRatioComponent {}
