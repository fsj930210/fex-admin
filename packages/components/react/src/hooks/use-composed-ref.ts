import { useMemo, type Ref } from 'react'

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') {
    ref(value)
    return
  }
  if (ref && 'current' in ref) {
    ref.current = value
  }
}

export function useComposedRef<T>(...refs: Array<Ref<T> | undefined>) {
  return useMemo(
    () => (value: T | null) => {
      for (const ref of refs) {
        assignRef(ref, value)
      }
    },
    // Recompose only when the caller-provided ref list changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  )
}
