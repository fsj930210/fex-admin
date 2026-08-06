import { useMemo, type ReactNode } from 'react'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { useTourContext } from './tour-context'
import type { TourStepOptions } from '@fex-design/core/tour/types'

export interface TourStepProps<TData = unknown> extends TourStepOptions<TData> {
  children?: ReactNode
}

export function TourStep<TData = unknown>({ children, ...step }: TourStepProps<TData>) {
  const { controller, snapshot } = useTourContext('TourStep')
  const {
    name,
    target,
    placement,
    arrow,
    mask,
    gap,
    scrollIntoViewOptions,
    disabledInteraction,
    data,
  } = step
  const stableStep = useMemo(
    () => ({
      name,
      ...(target === undefined ? {} : { target }),
      ...(placement === undefined ? {} : { placement }),
      ...(arrow === undefined ? {} : { arrow }),
      ...(mask === undefined ? {} : { mask }),
      ...(gap === undefined ? {} : { gap }),
      ...(scrollIntoViewOptions === undefined ? {} : { scrollIntoViewOptions }),
      ...(disabledInteraction === undefined ? {} : { disabledInteraction }),
      ...(data === undefined ? {} : { data }),
    }),
    [name, target, placement, arrow, mask, gap, scrollIntoViewOptions, disabledInteraction, data],
  )
  useIsomorphicLayoutEffect(() => controller.registerStep(stableStep), [controller, stableStep])
  if (snapshot.currentStep?.name !== stableStep.name) return null
  return children
}
