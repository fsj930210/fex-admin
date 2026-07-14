import type { TreeFeatureRegistration } from '../feature-types'
import type {
  TreeAsyncLoaderOptions,
  TreeItem,
  TreeKey,
  TreeLoadState,
  TreeMutationResult,
  TreeNodeData,
} from '../types'

export type AsyncLoadFeatureOptions<TNode extends TreeNodeData> = TreeAsyncLoaderOptions<TNode>

export interface AsyncLoadFeatureApi {
  load(key: TreeKey): Promise<unknown> | undefined
  retry(key: TreeKey): Promise<unknown> | undefined
  getState(key: TreeKey): TreeLoadState
  getError(key: TreeKey): unknown
}

interface TreeAsyncLoadManagerOptions<TNode extends TreeNodeData> {
  getLoader(): TreeAsyncLoaderOptions<TNode> | undefined
  getItem(key: TreeKey): TreeItem<TNode> | undefined
  replaceChildren(key: TreeKey, children: readonly TNode[]): TreeMutationResult
  publish(key: TreeKey): void
}

function createTreeAsyncLoadManager<TNode extends TreeNodeData>(
  options: TreeAsyncLoadManagerOptions<TNode>,
) {
  const states = new Map<TreeKey, TreeLoadState>()
  const errors = new Map<TreeKey, unknown>()
  const requests = new Map<TreeKey, Promise<TreeMutationResult | undefined>>()

  const load = (key: TreeKey): Promise<TreeMutationResult | undefined> | undefined => {
    const item = options.getItem(key)
    const loader = options.getLoader()
    if (!item || item.isLeaf || !loader) return undefined
    const inFlight = requests.get(key)
    if (inFlight) return inFlight
    if (states.get(key) === 'loaded') return undefined
    const controller = new AbortController()
    states.set(key, 'loading')
    errors.delete(key)
    options.publish(key)
    const request = loader.loadChildren(item, { signal: controller.signal })
      .then((children) => {
        if (controller.signal.aborted) return undefined
        states.set(key, 'loaded')
        return options.replaceChildren(key, children)
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          states.set(key, 'error')
          errors.set(key, error)
          loader.onLoadError?.(error, key)
          options.publish(key)
        }
        return undefined
      })
      .finally(() => requests.delete(key))
    requests.set(key, request)
    return request
  }

  return {
    getState: (key: TreeKey) => states.get(key) ?? 'unloaded',
    getError: (key: TreeKey) => errors.get(key),
    load,
    retry(key: TreeKey) {
      states.delete(key)
      errors.delete(key)
      return load(key)
    },
  }
}

export function asyncLoadFeature<TNode extends TreeNodeData>(
  options: AsyncLoadFeatureOptions<TNode>,
): TreeFeatureRegistration<TNode> {
  return {
    options,
    feature: {
      id: 'async-load',
      requires: ['expansion'],
      setup(context, rawOptions) {
        context.configure({ asyncLoader: rawOptions as AsyncLoadFeatureOptions<TNode> })
        const manager = createTreeAsyncLoadManager({
          getLoader: () => context.getOptions().asyncLoader,
          getItem: context.getItem,
          replaceChildren: context.replaceChildren,
          publish: (key) => context.updateFeatureState([key]),
        })
        return {
          load: manager.load,
          retry: manager.retry,
          getState: manager.getState,
          getError: manager.getError,
        } satisfies AsyncLoadFeatureApi
      },
    },
  }
}
