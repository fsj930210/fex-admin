import type { MasonryController } from '@fex-design/core/masonry/create-masonry-controller'
import type { MasonryControllerOptions } from '@fex-design/core/masonry/types'
export const masonryContextKey = Symbol('fex-masonry')
export interface MasonryContext { controller: MasonryController; options: () => MasonryControllerOptions }
