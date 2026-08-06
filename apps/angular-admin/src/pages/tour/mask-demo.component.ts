import { ChangeDetectionStrategy, Component, Directive, HostBinding, inject } from '@angular/core'
import { TourArrow, TourContent, TourOverlay, TourOverlayContent, TourPortal, TourRoot, TourStep, TourTarget } from '@fex-design/angular/primitive/tour'
import { TourPanelComponent } from './tour-panel.component'
import { TourStartComponent } from './tour-start.component'
@Directive({ selector: '[appTourMaskHighlight]', standalone: true })
class TourMaskHighlightDirective {
  private readonly root = inject(TourRoot)
  @HostBinding('style.left.px') get left() { return this.root.snapshot().targetRect?.x ?? 0 }
  @HostBinding('style.top.px') get top() { return this.root.snapshot().targetRect?.y ?? 0 }
  @HostBinding('style.width.px') get width() { return this.root.snapshot().targetRect?.width ?? 0 }
  @HostBinding('style.height.px') get height() { return this.root.snapshot().targetRect?.height ?? 0 }
}

@Component({ selector: 'app-tour-mask-demo', standalone: true, imports: [TourRoot, TourTarget, TourPortal, TourOverlay, TourOverlayContent, TourMaskHighlightDirective, TourStep, TourContent, TourArrow, TourPanelComponent, TourStartComponent], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './mask-demo.component.html' })
export class MaskDemoComponent {}
