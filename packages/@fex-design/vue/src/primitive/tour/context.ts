import type { Floating } from '@fex-design/core/floating/create-floating'
import type { TourController, TourSnapshot } from '@fex-design/core/tour/types'
import { inject, type InjectionKey, type ShallowRef } from 'vue'

export interface TourContextValue<TData = unknown> {
  controller: TourController<TData>
  snapshot: ShallowRef<TourSnapshot<TData>>
  overlay: boolean
  closeOnOverlayClick: boolean
  defaultGap: number
  zIndex: number
  getPopupContainer?: (referenceElement: HTMLElement | null) => HTMLElement
}

export interface TourContentContextValue {
  floating: Floating
  snapshot: ShallowRef<ReturnType<Floating['getSnapshot']>>
}

export const tourKey: InjectionKey<TourContextValue> = Symbol('Tour')
export const tourContentKey: InjectionKey<TourContentContextValue> = Symbol('TourContent')

export function useTourContext(component: string) {
  const context = inject(tourKey)
  if (!context) throw new Error(`${component} must be used inside TourRoot`)
  return context
}

export function useTourContentContext(component: string) {
  const context = inject(tourContentKey)
  if (!context) throw new Error(`${component} must be used inside TourContent`)
  return context
}
