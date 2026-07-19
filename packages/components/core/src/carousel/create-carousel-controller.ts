import EmblaCarousel, { type EmblaPluginType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import { createStore } from '../store/create-store'
import type { CarouselController, CarouselControllerConfig, CarouselSnapshot, CreateCarouselControllerOptions } from './types'

const initialSnapshot: CarouselSnapshot = {
  selectedIndex: 0,
  scrollSnapIndexes: [],
  canScrollPrev: false,
  canScrollNext: false,
  inViewIndexes: [],
  autoplay: { enabled: false, isPlaying: false },
}

/**
 * Embla owns measurements and motion; this controller only converts its imperative
 * events into the shared snapshot-store contract consumed by framework adapters.
 */
export function createCarouselController(config: CarouselControllerConfig = {}): CarouselController {
  const getConfig = typeof config === 'function' ? config : () => config
  const store = createStore(initialSnapshot)
  let embla: ReturnType<typeof EmblaCarousel> | undefined
  let viewportElement: HTMLElement | undefined

  function readSnapshot(): CarouselSnapshot {
    if (!embla) return initialSnapshot
    const autoplay = embla.plugins().autoplay
    return {
      selectedIndex: embla.selectedScrollSnap(),
      scrollSnapIndexes: embla.scrollSnapList().map((_, index) => index),
      canScrollPrev: embla.canScrollPrev(),
      canScrollNext: embla.canScrollNext(),
      inViewIndexes: embla.slidesInView(),
      autoplay: { enabled: Boolean(autoplay), isPlaying: autoplay?.isPlaying() ?? false },
    }
  }

  function sync() { store.setSnapshot(readSnapshot()) }
  function emitSelect() { sync(); getConfig().onSelect?.(store.getSnapshot()) }
  function emitSettle() { sync(); getConfig().onSettle?.(store.getSnapshot()) }

  function getPlugins(): EmblaPluginType[] {
    const currentConfig = getConfig()
    const plugins = currentConfig.plugins ?? []
    if (currentConfig.autoplay && plugins.some((plugin) => plugin.name === 'autoplay')) {
      throw new Error('Carousel autoplay conflicts with an Autoplay plugin passed through plugins.')
    }
    return [
      ...(currentConfig.autoplay ? [Autoplay(currentConfig.autoplay === true ? undefined : currentConfig.autoplay)] : []),
      ...plugins,
    ]
  }

  return {
    get embla() { return embla },
    get autoplay() { return embla?.plugins().autoplay },
    getSnapshot: store.getSnapshot,
    subscribe: store.subscribe,
    mount(viewport) {
      if (viewportElement === viewport && embla) return
      embla?.destroy()
      viewportElement = viewport
      embla = EmblaCarousel(viewport, getConfig().options, getPlugins())
      embla.on('select', emitSelect).on('reInit', sync).on('slidesInView', sync).on('autoplay:play', sync).on('autoplay:stop', sync)
      sync()
    },
    scrollTo(index, jump) { embla?.scrollTo(index, jump) },
    scrollPrev(jump) { embla?.scrollPrev(jump) },
    scrollNext(jump) { embla?.scrollNext(jump) },
    reInit(options, plugins) { embla?.reInit(options, plugins); sync() },
    destroy() { embla?.destroy(); embla = undefined; viewportElement = undefined; store.setSnapshot(initialSnapshot) },
  }
}
