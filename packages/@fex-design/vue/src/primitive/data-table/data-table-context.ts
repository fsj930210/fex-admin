import type { ComputedRef, InjectionKey } from 'vue'

export const dataTableRevisionKey: InjectionKey<ComputedRef<number>> =
  Symbol('fex-data-table-revision')
