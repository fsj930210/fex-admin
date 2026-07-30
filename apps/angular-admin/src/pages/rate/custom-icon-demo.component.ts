import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Rate } from '@fex/components-angular/primitive/rate'
import Card from '@fex/components-angular/ui/card'

@Component({ selector: 'fex-rate-custom-icon-demo', standalone: true, imports: [Card, Rate], templateUrl: './custom-icon-demo.component.html', changeDetection: ChangeDetectionStrategy.OnPush })
export class CustomIconDemoComponent {}
