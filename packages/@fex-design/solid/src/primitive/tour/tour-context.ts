import type { Floating } from '@fex-design/core/floating/create-floating'
import type { TourController, TourSnapshot } from '@fex-design/core/tour/types'
import { createContext, useContext, type Accessor } from 'solid-js'

export interface TourContextValue<TData = unknown> {
  controller: TourController<TData>
  snapshot: Accessor<TourSnapshot<TData>>
  overlay: boolean
  closeOnOverlayClick: boolean
  defaultGap: number
  zIndex: number
  getPopupContainer?: (referenceElement: HTMLElement | null) => HTMLElement
}
export interface TourContentContextValue {
  floating: Floating
  snapshot: Accessor<ReturnType<Floating['getSnapshot']>>
}
export const TourContext = createContext<TourContextValue>()
export const TourContentContext = createContext<TourContentContextValue>()
export function useTourContext(component: string) {
  const context = useContext(TourContext)
  if (!context) throw new Error(`${component} must be used inside TourRoot`)
  return context
}
export function useTourContentContext(component: string) {
  const context = useContext(TourContentContext)
  if (!context) throw new Error(`${component} must be used inside TourContent`)
  return context
}
