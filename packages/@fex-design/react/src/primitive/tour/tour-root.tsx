import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { useCoreStore } from '../../hooks/use-core-store'
import { useLazyRef } from '../../hooks/use-lazy-ref'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'
import { createTourController } from '@fex-design/core/tour/create-tour-controller'
import type { TourOptions } from '@fex-design/core/tour/types'
import { TourContext } from './tour-context'
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

export interface TourRootProps<TData = unknown> extends TourOptions<TData> {
  children: ReactNode
  keyboard?: boolean
  overlay?: boolean
  closeOnOverlayClick?: boolean
  defaultGap?: number
  getPopupContainer?: (referenceElement: HTMLElement | null) => HTMLElement
  zIndex?: number
}

export function TourRoot<TData = unknown>({
  children,
  keyboard = true,
  overlay = true,
  closeOnOverlayClick = true,
  defaultGap = 6,
  zIndex = 1001,
  ...options
}: TourRootProps<TData>) {
  const optionsRef = useRef(options)
  optionsRef.current = options
  const controller = useLazyRef(() => createTourController(optionsRef.current)).current
  const snapshot = useCoreStore(controller)

  useIsomorphicLayoutEffect(() => {
    controller.setOptions(optionsRef.current)
  }, [controller, options])

  useIsomorphicLayoutEffect(() => {
    const refresh = () => controller.refreshTarget()
    window.addEventListener('resize', refresh)
    window.addEventListener('scroll', refresh, true)
    return () => {
      window.removeEventListener('resize', refresh)
      window.removeEventListener('scroll', refresh, true)
    }
  }, [controller])

  const onKeyDown = useMemoizedFn((event: KeyboardEvent) => {
    if (!snapshot.open || !keyboard) return
    if (event.key === 'Escape') {
      event.preventDefault()
      controller.close()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      void controller.next()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      void controller.previous()
    }
  })

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onKeyDown])

  useIsomorphicLayoutEffect(
    () => () => controller.destroy(),
    [controller],
  )

  return (
    <TourContext
      value={{
        controller,
        snapshot,
        keyboard,
        overlay,
        closeOnOverlayClick,
        defaultGap,
        zIndex,
        getPopupContainer: options.getPopupContainer,
      }}
    >
      {children}
    </TourContext>
  )
}
