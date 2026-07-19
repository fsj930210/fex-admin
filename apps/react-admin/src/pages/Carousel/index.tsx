import AutoHeight from 'embla-carousel-auto-height'
import { ChevronLeftIcon, ChevronRightIcon } from '@fex/components-react/icon/chevron'
import { CarouselRoot, CarouselSlide, CarouselTrack, CarouselViewport, useCarouselContext } from '@fex/components-react/primitive/carousel'
import { Card } from '@fex/components-react/ui/card'
import { carouselIndicatorClassName, carouselIndicatorsClassName } from '@fex/components-styles/carousel'
import { Link } from 'react-router'

const slides = ['订单概览', '待办审批', '团队动态']
const autoHeightSlides = [
  { title: '订单概览', items: ['今日新增订单 24'] },
  { title: '待办审批', items: ['采购申请待审批', '预算调整待确认', '合同归档待处理'] },
  { title: '团队动态', items: ['版本 v2.8 已发布', '设计评审将在下午举行', '本周目标完成 72%', '两位新成员已加入项目'] },
]

function Slides() { return <>{slides.map((slide) => <CarouselSlide key={slide}><div className="flex h-40 items-center justify-center rounded-md bg-primary text-lg font-semibold text-primary-foreground">{slide}</div></CarouselSlide>)}</> }

function Controls() {
  const { controller, snapshot } = useCarouselContext()
  return <><div className="mt-3 flex justify-between"><button type="button" className="cursor-pointer p-2 disabled:cursor-not-allowed" aria-label="Previous slide" disabled={!snapshot.canScrollPrev} onClick={() => controller.scrollPrev()}><ChevronLeftIcon /></button><button type="button" className="cursor-pointer p-2 disabled:cursor-not-allowed" aria-label="Next slide" disabled={!snapshot.canScrollNext} onClick={() => controller.scrollNext()}><ChevronRightIcon /></button></div><div className={carouselIndicatorsClassName}>{snapshot.scrollSnapIndexes.map((index) => <button key={index} type="button" aria-current={snapshot.selectedIndex === index || undefined} aria-label={`Go to slide ${index + 1}`} className={carouselIndicatorClassName} onClick={() => controller.scrollTo(index)} />)}</div></>
}

export function CarouselPage() {
  return <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div className="mx-auto w-full max-w-5xl space-y-space-xl"><header className="space-y-space-md"><Link className="text-sm text-muted-foreground hover:text-foreground" to="/">返回首页</Link><h1 className="text-2xl font-semibold">Carousel</h1><p className="text-sm text-muted-foreground">仅提供 primitive；控制按钮与指示器由应用按需组合。</p></header><Card title="Primitive composition" description="通过 controller 自行实现 Previous、Next 与 Indicators。"><CarouselRoot options={{ loop: true }}><CarouselViewport><CarouselTrack><Slides /></CarouselTrack></CarouselViewport><Controls /></CarouselRoot></Card><Card title="Autoplay" description="Autoplay 是 primitive 的内置配置，controller.autoplay 返回官方实例。"><CarouselRoot options={{ loop: true }} autoplay={{ delay: 2500, stopOnInteraction: true }}><CarouselViewport><CarouselTrack><Slides /></CarouselTrack></CarouselViewport><Controls /></CarouselRoot></Card><Card title="Official plugin" description="AutoHeight 直接从 embla-carousel-auto-height 导入，不经过 FEX 封装。"><CarouselRoot plugins={[AutoHeight()]}><CarouselViewport><CarouselTrack>{autoHeightSlides.map((slide) => <article key={slide.title} role="group" aria-roledescription="slide" className="min-w-0 shrink-0 grow-0 basis-full rounded-md bg-muted-background p-6"><h3 className="text-base font-semibold">{slide.title}</h3><ul className="mt-3 space-y-2 text-sm text-muted-foreground">{slide.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</CarouselTrack></CarouselViewport><Controls /></CarouselRoot></Card></div></main>
}
