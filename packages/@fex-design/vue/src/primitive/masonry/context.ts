import type { MasonryController } from '@fex-design/core/masonry/create-masonry-controller'
import type { MasonryControllerOptions } from '@fex-design/core/masonry/types'
import { inject, type ComputedRef, type InjectionKey } from 'vue'

export interface MasonryContextValue { controller: MasonryController; options: ComputedRef<MasonryControllerOptions> }
export const masonryContextKey = Symbol('fex-masonry') as InjectionKey<MasonryContextValue>
export function useMasonryContext(part = 'Masonry') {
  const value = inject(masonryContextKey, null)
  if (!value) throw new Error(`${part} must be used inside MasonryRoot.`)
  return value
}
