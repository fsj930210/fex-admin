import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { CustomIconDemoComponent } from './custom-icon-demo.component'
import { FractionDemoComponent } from './fraction-demo.component'
import { IntegerDemoComponent } from './integer-demo.component'

@Component({
  selector: 'fex-rate-page',
  standalone: true,
  imports: [RouterLink, IntegerDemoComponent, FractionDemoComponent, CustomIconDemoComponent],
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RateComponent {}
