import { createContext, use } from 'react'
import type { TourController, TourSnapshot } from '@fex-design/core/tour/types'
import type { Floating } from '@fex-design/core/floating/create-floating'

export interface TourContextValue<TData = unknown> {
  controller: TourController<TData>
  snapshot: TourSnapshot<TData>
  keyboard: boolean
  overlay: boolean
  closeOnOverlayClick: boolean
  defaultGap: number
  zIndex: number
  getPopupContainer?: ((referenceElement: HTMLElement | null) => HTMLElement) | undefined
}

export const TourContext = createContext<TourContextValue | null>(null)

export function useTourContext(component: string) {
  const context = use(TourContext)
  if (!context) throw new Error(`${component} must be used inside Tour.Root`)
  return context
}

export interface TourContentContextValue {
  floating: Floating
  snapshot: ReturnType<Floating['getSnapshot']>
  setContentElement: (element: HTMLDivElement | null) => void
}

export const TourContentContext = createContext<TourContentContextValue | null>(null)

export function useTourContentContext(component: string) {
  const context = use(TourContentContext)
  if (!context) throw new Error(`${component} must be used inside Tour.Content`)
  return context
}
