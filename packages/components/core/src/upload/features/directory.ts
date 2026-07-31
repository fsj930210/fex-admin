import type { UploadFeatureRegistration } from '../feature-types'
export function directoryFeature<TResponse = unknown>(): UploadFeatureRegistration<TResponse> {
  return { options: {}, feature: { id: 'directory', setup: () => ({ enabled: true as const }) } }
}
