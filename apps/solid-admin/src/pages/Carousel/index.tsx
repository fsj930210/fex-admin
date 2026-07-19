import AutoHeight from 'embla-carousel-auto-height'
import { ChevronLeftIcon, ChevronRightIcon } from '@fex/components-solid/icon/chevron'
import { createCarousel } from '@fex/components-solid/primitives/create-carousel'
import { Card } from '@fex/components-solid/ui/card'
import { carouselIndicatorClassName, carouselIndicatorsClassName, carouselRootClassName, carouselTrackClassName, carouselViewportClassName } from '@fex/components-styles/carousel'
import type { CreateCarouselControllerOptions } from '@fex/components-core/carousel/types'
import { A } from '@solidjs/router'
import { For, type JSX } from 'solid-js'

const slides = ['订单概览', '待办审批', '团队动态']
const autoHeightSlides = [{ title: '订单概览', items: ['今日新增订单 24'] }, { title: '待办审批', items: ['采购申请待审批', '预算调整待确认', '合同归档待处理'] }, { title: '团队动态', items: ['版本 v2.8 已发布', '设计评审将在下午举行', '本周目标完成 72%', '两位新成员已加入项目'] }]

function PrimitiveCarousel(props: { config?: CreateCarouselControllerOptions; children: JSX.Element }) {
  const { controller, snapshot, mount } = createCarousel(props.config)
  return <div class={carouselRootClassName}><div ref={mount} role="region" aria-roledescription="carousel" class={carouselViewportClassName}><div class={carouselTrackClassName()}>{props.children}</div></div><div class="mt-3 flex justify-between"><button type="button" class="cursor-pointer p-2 disabled:cursor-not-allowed" aria-label="Previous slide" disabled={!snapshot().canScrollPrev} onClick={() => controller.scrollPrev()}><ChevronLeftIcon /></button><button type="button" class="cursor-pointer p-2 disabled:cursor-not-allowed" aria-label="Next slide" disabled={!snapshot().canScrollNext} onClick={() => controller.scrollNext()}><ChevronRightIcon /></button></div><div class={carouselIndicatorsClassName}><For each={snapshot().scrollSnapIndexes}>{(index) => <button type="button" aria-current={snapshot().selectedIndex === index || undefined} aria-label={`Go to slide ${index + 1}`} class={carouselIndicatorClassName} onClick={() => controller.scrollTo(index)} />}</For></div></div>
}

function Slides() { return <For each={slides}>{(slide) => <div role="group" aria-roledescription="slide" class="min-w-0 shrink-0 grow-0 basis-full"><div class="flex h-40 items-center justify-center rounded-md bg-primary text-primary-foreground">{slide}</div></div>}</For> }

export function CarouselPage() { return <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl"><A href="/" class="text-sm text-muted-foreground">返回首页</A><h1 class="text-2xl font-semibold">Carousel</h1><Card title="Primitive composition" description="控制 UI 由应用使用 controller 自行组合。"><PrimitiveCarousel config={{ options: { loop: true } }}><Slides /></PrimitiveCarousel></Card><Card title="Autoplay" description="通过 primitive 内置配置启用官方 Autoplay。"><PrimitiveCarousel config={{ options: { loop: true }, autoplay: { delay: 2500, stopOnInteraction: true } }}><Slides /></PrimitiveCarousel></Card><Card title="Official plugin" description="AutoHeight 直接从 embla-carousel-auto-height 导入，不经过 FEX 封装。"><PrimitiveCarousel config={{ plugins: [AutoHeight()] }}><For each={autoHeightSlides}>{(slide) => <article role="group" aria-roledescription="slide" class="min-w-0 shrink-0 grow-0 basis-full rounded-md bg-muted-background p-6"><h3 class="text-base font-semibold">{slide.title}</h3><ul class="mt-3 space-y-2 text-sm text-muted-foreground"><For each={slide.items}>{(item) => <li>{item}</li>}</For></ul></article>}</For></PrimitiveCarousel></Card></div></main> }
