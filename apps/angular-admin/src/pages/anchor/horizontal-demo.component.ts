import { ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core'
import { Anchor } from '@fex-design/angular/primitive/anchor'
import Card from '@fex-design/angular/ui/card'
@Component({ selector: 'fex-anchor-horizontal-demo', standalone: true, imports: [Card, Anchor], templateUrl: './horizontal-demo.component.html', changeDetection: ChangeDetectionStrategy.OnPush })
export class HorizontalDemo {
  protected readonly container = viewChild<ElementRef<HTMLElement>>('container')
  protected readonly getContainer = () => this.container()?.nativeElement ?? window
  protected readonly items = [{ key: 'horizontal-one', title: 'Overview', target: '#horizontal-overview' }, { key: 'horizontal-two', title: 'API', target: '#horizontal-api' }, { key: 'horizontal-three', title: 'Examples', target: '#horizontal-examples' }]
}
