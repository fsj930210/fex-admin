import type { ComputedRef, InjectionKey } from 'vue'

export const dataGridRevisionKey: InjectionKey<ComputedRef<number>> =
  Symbol('fex-data-grid-revision')
