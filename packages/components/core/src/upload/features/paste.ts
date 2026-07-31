import type { UploadFeatureRegistration } from '../feature-types'
export interface PasteFeatureApi {
  paste(files: readonly File[]): Promise<void>
}
export function pasteFeature<TResponse = unknown>(): UploadFeatureRegistration<TResponse> {
  return {
    options: {},
    feature: {
      id: 'paste',
      setup: (context) => ({ paste: (files) => context.addFiles(files) }) satisfies PasteFeatureApi,
    },
  }
}
