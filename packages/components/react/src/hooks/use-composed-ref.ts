import { type Ref } from 'react'
import { useLatest } from './use-latest'
import { useMemoizedFn } from './use-memoized-fn'

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
  const refsRef = useLatest(refs)
  return useMemoizedFn((value: T | null) => {
    for (const ref of refsRef.current) assignRef(ref, value)
  })
}
