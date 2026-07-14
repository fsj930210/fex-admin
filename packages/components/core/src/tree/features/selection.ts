import type { TreeFeatureRegistration } from '../feature-types'
import type { TreeItem, TreeKey, TreeNodeData } from '../types'

export interface SelectionFeatureOptions {
  defaultSelectedKeys?: readonly TreeKey[] | undefined
  multiple?: boolean | undefined
}

export interface SelectionFeatureApi {
  isMultiple(): boolean
  select(key: TreeKey): void
  unselect(key: TreeKey): void
  toggle(key: TreeKey): void
  selectAll(): void
  clear(): void
}

function getSelectedKeysAfterToggle(
  keys: readonly TreeKey[],
  key: TreeKey,
  selected: boolean,
  multiple: boolean,
) {
  if (!selected) return keys.filter((itemKey) => itemKey !== key)
  return multiple ? [...new Set([...keys, key])] : [key]
}

function getAllSelectableKeys<TNode extends TreeNodeData>(
  items: ReadonlyMap<TreeKey, TreeItem<TNode>>,
) {
  return [...items.values()].filter((item) => !item.disabled).map((item) => item.key)
}

export function selectionFeature<TNode extends TreeNodeData>(
  options: SelectionFeatureOptions = {},
): TreeFeatureRegistration<TNode> {
  return {
    options,
    feature: {
      id: 'selection',
      setup(context, featureOptions) {
        const normalizedOptions = featureOptions as SelectionFeatureOptions
        if (normalizedOptions.multiple !== undefined) {
          context.configure({ multiple: normalizedOptions.multiple })
        }
        const set = (key: TreeKey, selected: boolean) => {
          if (context.getItem(key)?.disabled) return
          context.setStateKeys(
            'selectedKeys',
            getSelectedKeysAfterToggle(
              context.getSnapshot().selectedKeys,
              key,
              selected,
              context.getOptions().multiple ?? false,
            ),
            [key],
          )
        }
        const api: SelectionFeatureApi = {
          isMultiple: () => context.getOptions().multiple ?? false,
          select: (key) => set(key, true),
          unselect: (key) => set(key, false),
          toggle: (key) => set(key, !context.getSnapshot().selectedKeys.includes(key)),
          selectAll: () => {
            if (!context.getOptions().multiple) return
            const keys = getAllSelectableKeys(context.getItems())
            context.setStateKeys('selectedKeys', keys, keys)
          },
          clear: () => context.setStateKeys(
            'selectedKeys',
            [],
            context.getSnapshot().selectedKeys,
          ),
        }
        let initialKeys = context.getSnapshot().selectedKeys
        for (const key of normalizedOptions.defaultSelectedKeys ?? []) {
          if (context.getItem(key)?.disabled) continue
          initialKeys = getSelectedKeysAfterToggle(
            initialKeys,
            key,
            true,
            context.getOptions().multiple ?? false,
          )
        }
        context.initializeStateKeys('selectedKeys', initialKeys)
        return api
      },
    },
  }
}
