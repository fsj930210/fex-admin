import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AnchorDemo } from './anchor-demo.component'
import { HorizontalDemo } from './horizontal-demo.component'
@Component({ selector: 'fex-anchor-page', standalone: true, imports: [RouterLink, AnchorDemo, HorizontalDemo], templateUrl: './index.component.html', changeDetection: ChangeDetectionStrategy.OnPush })
export class AnchorComponent {}

