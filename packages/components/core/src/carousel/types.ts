import type { EmblaCarouselType, EmblaOptionsType, EmblaPluginType } from 'embla-carousel'
import type { AutoplayOptionsType, AutoplayType } from 'embla-carousel-autoplay'
import type { SnapshotStore } from '../store/create-store'

export type CarouselOptions = EmblaOptionsType
export type CarouselPlugin = EmblaPluginType
export type CarouselAutoplay = boolean | AutoplayOptionsType

export interface CarouselSnapshot {
  selectedIndex: number
  scrollSnapIndexes: readonly number[]
  canScrollPrev: boolean
  canScrollNext: boolean
  inViewIndexes: readonly number[]
  autoplay: { enabled: boolean; isPlaying: boolean }
}

export interface CarouselController extends SnapshotStore<CarouselSnapshot> {
  readonly embla: EmblaCarouselType | undefined
  readonly autoplay: AutoplayType | undefined
  mount(viewport: HTMLElement): void
  scrollTo(index: number, jump?: boolean): void
  scrollPrev(jump?: boolean): void
  scrollNext(jump?: boolean): void
  reInit(options?: EmblaOptionsType, plugins?: EmblaPluginType[]): void
  destroy(): void
}

export interface CreateCarouselControllerOptions {
  options?: EmblaOptionsType
  plugins?: EmblaPluginType[]
  autoplay?: CarouselAutoplay
  onSelect?: (snapshot: CarouselSnapshot) => void
  onSettle?: (snapshot: CarouselSnapshot) => void
}

/** A lazy config source is required by adapters whose inputs are initialized after class fields. */
export type CarouselControllerConfig = CreateCarouselControllerOptions | (() => CreateCarouselControllerOptions)
