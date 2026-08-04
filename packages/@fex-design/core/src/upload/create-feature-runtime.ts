import type { UploadFeatureContext, UploadFeatureRegistration } from './feature-types'

function validateUploadFeatures<TResponse>(
  registrations: readonly UploadFeatureRegistration<TResponse>[],
) {
  const available = new Map<string, readonly string[]>()
  for (const { feature } of registrations) {
    if (available.has(feature.id))
      throw new Error(`Upload feature "${feature.id}" was installed more than once.`)
    for (const dependency of feature.requires ?? []) {
      if (!available.has(dependency))
        throw new Error(
          `Upload feature "${feature.id}" requires "${dependency}" to be installed first.`,
        )
    }
    for (const [id, conflicts] of available) {
      if ((feature.conflicts ?? []).includes(id) || conflicts.includes(feature.id)) {
        throw new Error(`Upload feature "${feature.id}" conflicts with "${id}".`)
      }
    }
    available.set(feature.id, feature.conflicts ?? [])
  }
}

export function createUploadFeatureRuntime<TResponse>(context: UploadFeatureContext<TResponse>) {
  const installed = new Map<string, { api: unknown; conflicts: readonly string[] }>()

  return {
    installAll(registrations: readonly UploadFeatureRegistration<TResponse>[]) {
      validateUploadFeatures(registrations)
      for (const { feature, options } of registrations) {
        const api = feature.setup(context, options)
        installed.set(feature.id, { api, conflicts: feature.conflicts ?? [] })
      }
    },
    has: (id: string) => installed.has(id),
    get: <TApi>(id: string) => installed.get(id)?.api as TApi | undefined,
  }
}
