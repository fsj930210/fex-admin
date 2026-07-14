import type { TreeFeatureRegistration } from '../feature-types'
import type {
  TreeCheckMode,
  TreeCheckedState,
  TreeItem,
  TreeKey,
  TreeNodeData,
} from '../types'

export interface CheckFeatureOptions {
  mode?: TreeCheckMode | undefined
  defaultCheckedKeys?: readonly TreeKey[] | undefined
}

export interface CheckFeatureApi {
  check(key: TreeKey, checked?: boolean): void
  uncheck(key: TreeKey): void
  checkAll(): void
  clear(): void
  getState(key: TreeKey): TreeCheckedState
}

interface TreeRelations<TNode extends TreeNodeData> {
  getItem(key: TreeKey): TreeItem<TNode> | undefined
  getChildrenKeys(key: TreeKey | null): readonly TreeKey[]
  getAncestorKeys(key: TreeKey): readonly TreeKey[]
  getDescendantKeys(key: TreeKey): readonly TreeKey[]
}

function getCheckedState<TNode extends TreeNodeData>(
  keys: readonly TreeKey[],
  key: TreeKey,
  mode: TreeCheckMode,
  relations: TreeRelations<TNode>,
): TreeCheckedState {
  if (keys.includes(key)) return true
  if (mode === 'strict') return false
  return relations.getDescendantKeys(key).some((descendant) => keys.includes(descendant))
    ? 'indeterminate'
    : false
}

function getCheckedKeysAfterToggle<TNode extends TreeNodeData>(
  keys: readonly TreeKey[],
  key: TreeKey,
  checked: boolean,
  mode: TreeCheckMode,
  relations: TreeRelations<TNode>,
) {
  const next = new Set(keys)
  const affected = new Set<TreeKey>([key])
  const toggle = (itemKey: TreeKey) => {
    const item = relations.getItem(itemKey)
    if (!item || item.disabled) return
    affected.add(itemKey)
    if (checked) next.add(itemKey)
    else next.delete(itemKey)
  }
  toggle(key)
  if (mode === 'cascade') {
    relations.getDescendantKeys(key).forEach(toggle)
    for (const ancestor of relations.getAncestorKeys(key)) {
      affected.add(ancestor)
      const enabledChildren = relations
        .getChildrenKeys(ancestor)
        .filter((child) => !relations.getItem(child)?.disabled)
      if (enabledChildren.length > 0 && enabledChildren.every((child) => next.has(child))) {
        next.add(ancestor)
      } else {
        next.delete(ancestor)
      }
    }
  }
  return { keys: [...next], affectedKeys: [...affected] }
}

export function checkFeature<TNode extends TreeNodeData>(
  options: CheckFeatureOptions = {},
): TreeFeatureRegistration<TNode> {
  return {
    options,
    feature: {
      id: 'check',
      setup(context, rawOptions) {
        const featureOptions = rawOptions as CheckFeatureOptions
        if (featureOptions.mode !== undefined) {
          context.configure({ checkMode: featureOptions.mode })
        }
        const relations = {
          getItem: context.getItem,
          getChildrenKeys: context.getChildrenKeys,
          getAncestorKeys: context.getAncestorKeys,
          getDescendantKeys: context.getDescendantKeys,
        }
        const getMode = () => context.getOptions().checkMode ?? 'cascade'
        const set = (key: TreeKey, checked: boolean) => {
          const item = context.getItem(key)
          if (!item || item.disabled) return
          const result = getCheckedKeysAfterToggle(
            context.getSnapshot().checkedKeys,
            key,
            checked,
            getMode(),
            relations,
          )
          context.setStateKeys('checkedKeys', result.keys, result.affectedKeys)
        }
        const api: CheckFeatureApi = {
          check: (key, checked = true) => set(key, checked),
          uncheck: (key) => set(key, false),
          checkAll: () => {
            const keys = [...context.getItems().values()]
              .filter((item) => !item.disabled)
              .map((item) => item.key)
            context.setStateKeys('checkedKeys', keys, keys)
          },
          clear: () => context.setStateKeys('checkedKeys', [], context.getSnapshot().checkedKeys),
          getState: (key) => getCheckedState(
            context.getSnapshot().checkedKeys,
            key,
            getMode(),
            relations,
          ),
        }
        let initialKeys = context.getSnapshot().checkedKeys
        for (const key of featureOptions.defaultCheckedKeys ?? []) {
          const item = context.getItem(key)
          if (!item || item.disabled) continue
          initialKeys = getCheckedKeysAfterToggle(
            initialKeys,
            key,
            true,
            getMode(),
            relations,
          ).keys
        }
        context.initializeStateKeys('checkedKeys', initialKeys)
        return api
      },
    },
  }
}
