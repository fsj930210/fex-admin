import { createUploadController } from '@fex/components-core/upload/create-upload-controller'
import type { UploadController, UploadOptions } from '@fex/components-core/upload/types'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { useLazyRef } from '../../hooks/use-lazy-ref'

export function useUpload<TResponse>(options: UploadOptions<TResponse>) {
  return useUploadController(options)
}

export function useUploadController<TResponse>(options: UploadOptions<TResponse> | undefined, supplied?: UploadController<TResponse>) {
  const owned = useLazyRef(() => createUploadController(options ?? {}))
  const controller = supplied ?? owned.current
  useIsomorphicLayoutEffect(() => { if (options) controller.updateOptions(options) }, [controller, options])
  return controller
}
