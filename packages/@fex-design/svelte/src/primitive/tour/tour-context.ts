import type { Floating } from '@fex-design/core/floating/create-floating'
import type { TourController, TourSnapshot } from '@fex-design/core/tour/types'
import type { Readable } from 'svelte/store'
import { getContext } from 'svelte'
export const tourContextKey = Symbol('Tour')
export const tourContentContextKey = Symbol('TourContent')
export interface TourContext { controller: TourController; snapshot: Readable<TourSnapshot>; overlay: boolean; closeOnOverlayClick: boolean; defaultGap: number; zIndex: number; getPopupContainer?: (referenceElement: HTMLElement | null) => HTMLElement }
export interface TourContentContext { floating: Floating; snapshot: Readable<ReturnType<Floating['getSnapshot']>> }
export function useTour() {
  return getContext<TourContext>(tourContextKey)
}
