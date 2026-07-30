import { createRateController } from '@fex/components-core/rate/create-rate-controller'
import type { RateOptions } from '@fex/components-core/rate/types'
import { useRef } from 'react'
import { useCoreStore } from '../../hooks/use-core-store'
import { useLazyRef } from '../../hooks/use-lazy-ref'

export function useRate(options: RateOptions) {
  const optionsRef = useRef<RateOptions>(options)
  Object.assign(optionsRef.current, options)
  const controllerRef = useLazyRef(() => createRateController(optionsRef.current))
  const snapshot = useCoreStore(controllerRef.current)

  return {
    controller: controllerRef.current,
    snapshot,
  }
}
