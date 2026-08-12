import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core'
import { Anchor, type AnchorItem } from '@fex-design/angular/primitive/anchor'
import Card from '@fex-design/angular/ui/card'

@Component({ selector: 'fex-anchor-demo', standalone: true, imports: [Card, Anchor], templateUrl: './anchor-demo.component.html', changeDetection: ChangeDetectionStrategy.OnPush })
export class AnchorDemo {
  protected readonly container = viewChild<ElementRef<HTMLElement>>('container')
  protected readonly activeKeys = signal<readonly string[]>([])
  protected readonly currentKeys = signal<readonly string[]>([])
  protected readonly items: AnchorItem<string>[] = [
    { key: 'anchor-overview', title: 'Overview', target: '#anchor-overview' },
    { key: 'anchor-api', title: 'API', target: '#anchor-api', children: [{ key: 'anchor-props', title: 'Props', target: '#anchor-props' }] },
    { key: 'anchor-examples', title: 'Examples', target: '#anchor-examples' },
  ]
  protected readonly getContainer = () => this.container()?.nativeElement ?? window
}
