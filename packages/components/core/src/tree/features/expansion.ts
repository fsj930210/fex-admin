import type { TreeFeatureRegistration } from '../feature-types'
import type { TreeItem, TreeKey, TreeNodeData } from '../types'

export interface ExpansionFeatureOptions {
  defaultExpandedKeys?: readonly TreeKey[] | undefined
}

export interface ExpansionFeatureApi {
  expand(key: TreeKey): void
  collapse(key: TreeKey): void
  toggle(key: TreeKey): void
  expandAll(): void
  collapseAll(): void
}

function getExpandedKeysAfterToggle(keys: readonly TreeKey[], key: TreeKey, expanded: boolean) {
  if (expanded) return keys.includes(key) ? keys : [...keys, key]
  return keys.filter((itemKey) => itemKey !== key)
}

function getAllExpandableKeys<TNode extends TreeNodeData>(
  items: ReadonlyMap<TreeKey, TreeItem<TNode>>,
) {
  return [...items.values()]
    .filter((item) => !item.isLeaf && !item.disabled)
    .map((item) => item.key)
}

export function expansionFeature<TNode extends TreeNodeData>(
  options: ExpansionFeatureOptions = {},
): TreeFeatureRegistration<TNode> {
  return {
    options,
    feature: {
      id: 'expansion',
      setup(context, featureOptions) {
        const normalizedOptions = featureOptions as ExpansionFeatureOptions
        const set = (key: TreeKey, expanded: boolean) => {
          const item = context.getItem(key)
          if (!item || item.isLeaf || item.disabled) return
          context.setStateKeys(
            'expandedKeys',
            getExpandedKeysAfterToggle(context.getSnapshot().expandedKeys, key, expanded),
            [key],
          )
        }
        const api: ExpansionFeatureApi = {
          expand: (key) => set(key, true),
          collapse: (key) => set(key, false),
          toggle: (key) => set(key, !context.getSnapshot().expandedKeys.includes(key)),
          expandAll: () => {
            const keys = getAllExpandableKeys(context.getItems())
            context.setStateKeys('expandedKeys', keys, keys)
          },
          collapseAll: () => context.setStateKeys(
            'expandedKeys',
            [],
            context.getSnapshot().expandedKeys,
          ),
        }
        const defaultKeys = (normalizedOptions.defaultExpandedKeys ?? []).filter((key) => {
          const item = context.getItem(key)
          return item && !item.isLeaf && !item.disabled
        })
        if (defaultKeys.length > 0) {
          context.initializeStateKeys(
            'expandedKeys',
            [...context.getSnapshot().expandedKeys, ...defaultKeys],
          )
        }
        return api
      },
    },
  }
}
