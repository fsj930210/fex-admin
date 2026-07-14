import type { TreeFeatureRegistration } from '../feature-types'
import type { TreeItem, TreeKey, TreeNodeData } from '../types'

export interface FocusFeatureApi {
  focus(key: TreeKey | null): void
  reveal(key: TreeKey): boolean
}

function getRevealExpandedKeys<TNode extends TreeNodeData>(
  expandedKeys: readonly TreeKey[],
  key: TreeKey,
  items: ReadonlyMap<TreeKey, TreeItem<TNode>>,
  getAncestorKeys: (key: TreeKey) => readonly TreeKey[],
) {
  if (!items.has(key)) return undefined
  return [
    ...new Set([
      ...expandedKeys,
      ...getAncestorKeys(key).filter((ancestor) => !items.get(ancestor)?.isLeaf),
    ]),
  ]
}
export function focusFeature<TNode extends TreeNodeData>(): TreeFeatureRegistration<TNode> {
  return {
    options: undefined,
    feature: {
      id: 'focus',
      requires: ['expansion'],
      setup: (context) => ({
        focus: (key) => context.setFocusedKey(key),
        reveal: (key) => {
          const next = getRevealExpandedKeys(
            context.getSnapshot().expandedKeys,
            key,
            context.getItems(),
            context.getAncestorKeys,
          )
          if (!next) return false
          context.setStateKeys('expandedKeys', next, context.getAncestorKeys(key))
          return true
        },
      }) satisfies FocusFeatureApi,
    },
  }
}
