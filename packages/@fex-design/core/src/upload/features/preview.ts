import type { UploadFeatureRegistration } from '../feature-types'
import type { UploadId } from '../types'
export interface PreviewFeatureApi {
  getUrl(id: UploadId): string | undefined
}
export function previewFeature<TResponse = unknown>(): UploadFeatureRegistration<TResponse> {
  return {
    options: {},
    feature: {
      id: 'preview',
      setup(context) {
        const urls = new Map<UploadId, string>()
        const revoke = (id: UploadId) => {
          const url = urls.get(id)
          if (url) URL.revokeObjectURL(url)
          urls.delete(id)
        }
        context.onRemove(revoke)
        context.onDestroy(() => {
          for (const id of urls.keys()) revoke(id)
        })
        return {
          getUrl(id) {
            const existing = urls.get(id)
            if (existing) return existing
            const file = context.getItem(id)?.file
            if (!file) return undefined
            const url = URL.createObjectURL(file)
            urls.set(id, url)
            return url
          },
        } satisfies PreviewFeatureApi
      },
    },
  }
}
