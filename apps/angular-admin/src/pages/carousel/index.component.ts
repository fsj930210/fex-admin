import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, viewChild } from '@angular/core'
import AutoHeight from 'embla-carousel-auto-height'
import { RouterLink } from '@angular/router'
import { createCarousel } from '@fex/components-angular/primitive/carousel'
import { Card } from '@fex/components-angular/ui/card'
import { carouselRootClassName, carouselTrackClassName, carouselViewportClassName } from '@fex/components-styles/carousel'
import { CarouselControlsComponent } from './carousel-controls.component'

@Component({ selector: 'fex-carousel-page', imports: [RouterLink, Card, CarouselControlsComponent], templateUrl: './index.component.html', changeDetection: ChangeDetectionStrategy.OnPush })
export class CarouselComponent {
  protected readonly classNames = { root: carouselRootClassName, viewport: carouselViewportClassName, track: carouselTrackClassName() }
  protected readonly slides = ['订单概览', '待办审批', '团队动态']
  protected readonly autoHeightSlides = [{ title: '订单概览', items: ['今日新增订单 24'] }, { title: '待办审批', items: ['采购申请待审批', '预算调整待确认', '合同归档待处理'] }, { title: '团队动态', items: ['版本 v2.8 已发布', '设计评审将在下午举行', '本周目标完成 72%', '两位新成员已加入项目'] }]
  protected readonly basicCarousel = createCarousel({ options: { loop: true } })
  protected readonly autoplayCarousel = createCarousel({ options: { loop: true }, autoplay: { delay: 2500, stopOnInteraction: true } })
  protected readonly autoHeightCarousel = createCarousel({ plugins: [AutoHeight()] })
  readonly basicViewport = viewChild.required<ElementRef<HTMLElement>>('basicViewport')
  readonly autoplayViewport = viewChild.required<ElementRef<HTMLElement>>('autoplayViewport')
  readonly autoHeightViewport = viewChild.required<ElementRef<HTMLElement>>('autoHeightViewport')

  constructor() { afterNextRender(() => { this.basicCarousel.mount(this.basicViewport().nativeElement); this.autoplayCarousel.mount(this.autoplayViewport().nativeElement); this.autoHeightCarousel.mount(this.autoHeightViewport().nativeElement) }) }
}
