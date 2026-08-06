import { createFloating } from '@fex-design/core/floating/create-floating'
import type { TourRegisteredStep } from '@fex-design/core/tour/types'
import { cn } from '@fex/utils'
import { tourContentClassName } from '@fex-design/styles/tour'
import type { CSSProperties, ComponentProps, ReactNode, Ref } from 'react'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'
import { useComposedRef } from '../../hooks/use-composed-ref'
import { useCoreStore } from '../../hooks/use-core-store'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { useLazyRef } from '../../hooks/use-lazy-ref'
import { TourContentContext } from './tour-context'
import { useTourContext } from './tour-context'

export interface TourContentRenderProps<TData = unknown> {
  props: ComponentProps<'div'>
  step: TourRegisteredStep<TData>
  index: number
  total: number
}

export interface TourContentProps<TData = unknown> extends Omit<ComponentProps<'div'>, 'children'> {
  ref?: Ref<HTMLDivElement>
  children?: ReactNode | ((props: TourContentRenderProps<TData>) => ReactNode)
}

export function TourContent<TData = unknown>({
  children,
  className,
  style,
  ref,
  ...props
}: TourContentProps<TData>) {
  const { controller, snapshot, defaultGap, zIndex } = useTourContext('TourContent')
  const step = snapshot.currentStep as TourRegisteredStep<TData> | null
  const floating = useLazyRef(() => createFloating({ placement: 'bottom', arrow: true, offset: 12 })).current
  const floatingSnapshot = useCoreStore(floating)
  const setContentElement = useMemoizedFn((element: HTMLDivElement | null) => floating.setFloatingElement(element))
  const contentRef = useComposedRef(setContentElement, ref)
  const target = step?.target ? controller.getTarget(step.target) : null
  const showArrow = step?.arrow !== false
  const stepGap = step?.gap?.offset ?? defaultGap
  const spotlightGap = Array.isArray(stepGap) ? Math.max(stepGap[0], stepGap[1]) : stepGap
  const floatingOffset = spotlightGap + 12

  useIsomorphicLayoutEffect(() => {
    floating.setOptions({
      placement: step?.placement ?? 'bottom',
      arrow: showArrow,
      offset: floatingOffset,
    })
    floating.setReferenceElement(target)
    if (snapshot.open && target) floating.startAutoUpdate()
    else floating.stopAutoUpdate()
    return () => floating.stopAutoUpdate()
  }, [floating, snapshot.open, target, step?.placement, showArrow, floatingOffset])

  useIsomorphicLayoutEffect(() => () => floating.destroy(), [floating])

  if (!snapshot.open || !step) return null
  const contentProps = {
    ...props,
    ref: contentRef,
    role: props.role ?? 'dialog',
    tabIndex: props.tabIndex ?? -1,
    'data-slot': 'tour-content',
    'data-side': floatingSnapshot.side,
    'data-placement': floatingSnapshot.placement,
    className: cn(tourContentClassName, className),
    style: {
      position: 'var(--floating-strategy, absolute)',
      left: 'var(--floating-x, 0px)',
      top: 'var(--floating-y, 0px)',
      transformOrigin: 'var(--floating-transform-origin)',
      zIndex,
      ...style,
    } as CSSProperties,
  } satisfies ComponentProps<'div'> & {
    'data-slot': string
    'data-side': string
    'data-placement': string
  }
  const renderProps = { props: contentProps, step, index: snapshot.currentIndex, total: snapshot.total }
  const content = typeof children === 'function' ? children(renderProps) : <div {...contentProps}>{children}</div>
  return (
    <TourContentContext value={{ floating, snapshot: floatingSnapshot, setContentElement }}>
      {content}
    </TourContentContext>
  )
}
