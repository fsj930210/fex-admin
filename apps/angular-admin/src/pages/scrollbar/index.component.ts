import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ScrollbarBar, ScrollbarCorner, ScrollbarRoot, ScrollbarThumb, ScrollbarTrack, ScrollbarViewport } from '@fex/components-angular/primitive/scrollbar'
import Card from '@fex/components-angular/ui/card'

@Component({ selector: 'fex-scrollbar-page', imports: [RouterLink, Card, ScrollbarRoot, ScrollbarViewport, ScrollbarBar, ScrollbarTrack, ScrollbarThumb, ScrollbarCorner], host: { class: 'block' }, templateUrl: './index.component.html', changeDetection: ChangeDetectionStrategy.OnPush })
export class ScrollbarComponent {
  protected readonly items = Array.from({ length: 30 }, (_, index) => index + 1)
  protected readonly virtualStart = signal(0)
  protected readonly virtualRows = computed(() => Array.from({ length: 14 }, (_, index) => this.virtualStart() + index + 1).filter((row) => row <= 300))
  protected onVirtualScroll({ scrollTop }: { scrollTop: number }) { this.virtualStart.set(Math.floor(scrollTop / 40)) }
}
