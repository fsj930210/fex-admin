import type {
  TreeFeature,
  TreeFeatureContext,
  TreeFeatureId,
  TreeFeatureRegistration,
} from './feature-types'
import type { TreeNodeData } from './types'

export interface TreeFeatureRuntime<TNode extends TreeNodeData> {
  install<TOptions, TApi>(feature: TreeFeature<TNode, TOptions, TApi>, options: TOptions): TApi
  installAll(registrations: readonly TreeFeatureRegistration<TNode>[]): void
  has(id: TreeFeatureId): boolean
  get<TApi>(id: TreeFeatureId): TApi | undefined
  ids(): readonly TreeFeatureId[]
}

/** Validates a feature graph before any feature side effect runs. */
export function createTreeFeatureRuntime<TNode extends TreeNodeData>(context: TreeFeatureContext<TNode>): TreeFeatureRuntime<TNode> {
  const installed = new Map<TreeFeatureId, { api: unknown; conflicts: readonly TreeFeatureId[] }>()

  const validate = (registrations: readonly TreeFeatureRegistration<TNode>[]) => {
    const available = new Map<TreeFeatureId, readonly TreeFeatureId[]>(
      [...installed].map(([id, value]) => [id, value.conflicts]),
    )
    for (const { feature } of registrations) {
      if (available.has(feature.id)) {
        throw new Error(`Tree feature "${feature.id}" was installed more than once.`)
      }
      for (const dependency of feature.requires ?? []) {
        if (!available.has(dependency)) {
          throw new Error(`Tree feature "${feature.id}" requires "${dependency}" to be installed first.`)
        }
      }
      for (const [availableId, conflicts] of available) {
        if ((feature.conflicts ?? []).includes(availableId) || conflicts.includes(feature.id)) {
          throw new Error(`Tree feature "${feature.id}" conflicts with "${availableId}".`)
        }
      }
      available.set(feature.id, feature.conflicts ?? [])
    }
  }

  return {
    install(feature, options) {
      if (installed.has(feature.id)) {
        throw new Error(`Tree feature "${feature.id}" was installed more than once.`)
      }
      for (const dependency of feature.requires ?? []) {
        if (!installed.has(dependency)) {
          throw new Error(`Tree feature "${feature.id}" requires "${dependency}" to be installed first.`)
        }
      }
      for (const [installedId, installedFeature] of installed) {
        if ((feature.conflicts ?? []).includes(installedId) || installedFeature.conflicts.includes(feature.id)) {
          throw new Error(`Tree feature "${feature.id}" conflicts with "${installedId}".`)
        }
      }
      const api = feature.setup(context, options)
      installed.set(feature.id, { api, conflicts: feature.conflicts ?? [] })
      return api
    },
    installAll(registrations) {
      validate(registrations)
      for (const registration of registrations) {
        this.install(registration.feature, registration.options)
      }
    },
    has(id) {
      return installed.has(id)
    },
    get(id) {
      return installed.get(id)?.api as never
    },
    ids() {
      return [...installed.keys()]
    },
  }
}
