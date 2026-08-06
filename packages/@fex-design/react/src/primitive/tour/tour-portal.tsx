import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { useTourContext } from './tour-context'

export interface TourPortalProps {
  children?: ReactNode
  container?: HTMLElement | null
}

export function TourPortal({ children, container }: TourPortalProps) {
  const { snapshot, getPopupContainer, controller } = useTourContext('TourPortal')
  if (typeof document === 'undefined') return null
  const target = snapshot.currentStep?.target ? controller.getTarget(snapshot.currentStep.target) : null
  const popupContainer = container ?? getPopupContainer?.(target) ?? document.body
  return popupContainer ? createPortal(children, popupContainer) : null
}
