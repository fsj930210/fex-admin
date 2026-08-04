import { createCarouselController } from '@fex-design/core/carousel/create-carousel-controller'
import type {
  CarouselController,
  CreateCarouselControllerOptions,
} from '@fex-design/core/carousel/types'
import {
  carouselRootClassName,
  carouselSlideClassName,
  carouselTrackClassName,
  carouselViewportClassName,
} from '@fex-design/styles/carousel'
import { cn } from '@fex/utils'
import {
  createContext,
  use,
  useEffectEvent,
  useRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react'
import { useCoreStore } from '../../hooks/use-core-store'
import { useLazyRef } from '../../hooks/use-lazy-ref'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'
import useUnmount from '../../hooks/use-unmount'

type ContextValue = {
  controller: CarouselController
  snapshot: ReturnType<CarouselController['getSnapshot']>
}
const CarouselContext = createContext<ContextValue | null>(null)

export function useCarouselContext() {
  const context = use(CarouselContext)
  if (!context) throw new Error('Carousel parts must be rendered inside CarouselRoot.')
  return context
}

export interface CarouselRootProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'>, CreateCarouselControllerOptions {
  children?: ReactNode
  controllerRef?: Ref<CarouselController>
}

export function CarouselRoot({
  children,
  controllerRef,
  options,
  plugins,
  autoplay,
  onSelect,
  onSettle,
  className,
  ...domProps
}: CarouselRootProps) {
  const selectEvent = useEffectEvent((snapshot: ReturnType<CarouselController['getSnapshot']>) =>
    onSelect?.(snapshot),
  )
  const settleEvent = useEffectEvent((snapshot: ReturnType<CarouselController['getSnapshot']>) =>
    onSettle?.(snapshot),
  )
  const currentConfig: CreateCarouselControllerOptions = {
    ...(options === undefined ? {} : { options }),
    ...(plugins === undefined ? {} : { plugins }),
    ...(autoplay === undefined ? {} : { autoplay }),
    onSelect: selectEvent,
    onSettle: settleEvent,
  }
  const configRef = useRef<CreateCarouselControllerOptions>(currentConfig)
  configRef.current = currentConfig
  const controller = useLazyRef(() => createCarouselController(configRef.current)).current
  const snapshot = useCoreStore(controller)
  useUnmount(() => controller.destroy())
  if (typeof controllerRef === 'function') controllerRef(controller)
  else if (controllerRef) controllerRef.current = controller
  return (
    <CarouselContext value={{ controller, snapshot }}>
      <div {...domProps} className={cn(carouselRootClassName, className)}>
        {children}
      </div>
    </CarouselContext>
  )
}

export function CarouselViewport({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { controller } = useCarouselContext()
  const setViewport = useMemoizedFn((node: HTMLDivElement | null) => {
    if (node) controller.mount(node)
  })
  return (
    <div
      {...props}
      ref={setViewport}
      role="region"
      aria-roledescription="carousel"
      className={cn(carouselViewportClassName, className)}
    />
  )
}

export function CarouselTrack({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn(carouselTrackClassName(), className)} />
}

export function CarouselSlide({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      role="group"
      aria-roledescription="slide"
      className={cn(carouselSlideClassName, className)}
    />
  )
}
