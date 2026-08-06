import type { HTMLAttributes, ReactElement, Ref } from 'react'
import { useRef } from 'react'
import { useComposedRef } from '../../hooks/use-composed-ref'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'
import { useTourContext } from './tour-context'

export interface TourTargetRenderProps<TElement extends HTMLElement = HTMLElement>
  extends HTMLAttributes<TElement> {
  ref: Ref<TElement>
  'data-tour-target': string
}

export interface TourTargetProps<TElement extends HTMLElement = HTMLElement> {
  name: string
  children: (props: TourTargetRenderProps<TElement>) => ReactElement | null
}

export function TourTarget<TElement extends HTMLElement = HTMLElement>({ name, children }: TourTargetProps<TElement>) {
  const { controller } = useTourContext('TourTarget')
  const elementRef = useRef<TElement | null>(null)
  const resolver = useMemoizedFn(() => elementRef.current)
  const composedRef = useComposedRef<TElement>((element) => {
    elementRef.current = element
    controller.refreshTarget()
  })

  useIsomorphicLayoutEffect(
    () => controller.registerTarget(name, resolver),
    [controller, name, resolver],
  )

  return children({ ref: composedRef, 'data-tour-target': name })
}
