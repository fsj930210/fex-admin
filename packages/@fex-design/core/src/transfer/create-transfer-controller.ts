import { createStore } from '../store/create-store'
import type {
  TransferChangeAction,
  TransferCheckedKeys,
  TransferController,
  TransferControllerOptions,
  TransferDataItem,
  TransferKey,
  TransferSide,
  TransferSnapshot,
} from './types'
import {
  readTransferDisabled,
  readTransferKey,
  resolveTransferFieldNames,
  uniqueTransferKeys,
} from './utils'

export function createTransferController<TItem extends TransferDataItem>(
  initialOptions: TransferControllerOptions<TItem>,
): TransferController<TItem> {
  let options = initialOptions
  let itemsReference = options.items
  let hasResolvedInitialItems = options.items.length > 0
  let uncontrolledTargetKeys = uniqueTransferKeys(options.defaultTargetKeys ?? [])
  let uncontrolledChecked: TransferCheckedKeys = {
    source: uniqueTransferKeys(options.defaultCheckedKeys?.source ?? []),
    target: uniqueTransferKeys(options.defaultCheckedKeys?.target ?? []),
  }
  let ignoreControlledChecked = false

  function deriveSnapshot(): TransferSnapshot<TItem> {
    const fields = resolveTransferFieldNames(options.fieldNames)
    const itemsByKey = new Map<TransferKey, TItem>()
    for (const item of options.items) itemsByKey.set(readTransferKey(item, fields), item)

    const rawTargetKeys = options.targetKeys ?? uncontrolledTargetKeys
    const targetKeys = uniqueTransferKeys(rawTargetKeys).filter((key) => itemsByKey.has(key))
    const targetSet = new Set(targetKeys)
    const sourceItems = options.items.filter(
      (item) => !targetSet.has(readTransferKey(item, fields)),
    )
    const targetItems = targetKeys
      .map((key) => itemsByKey.get(key))
      .filter((item): item is TItem => item !== undefined)
    const normalizeChecked = (side: TransferSide, keys: readonly TransferKey[]) => {
      const sideSet =
        side === 'source'
          ? new Set(sourceItems.map((item) => readTransferKey(item, fields)))
          : targetSet
      return uniqueTransferKeys(keys).filter((key) => {
        const item = itemsByKey.get(key)
        return item !== undefined && sideSet.has(key) && !readTransferDisabled(item, fields)
      })
    }

    return {
      sourceItems,
      targetItems,
      sourceKeys: sourceItems.map((item) => readTransferKey(item, fields)),
      targetKeys,
      sourceCheckedKeys: normalizeChecked(
        'source',
        ignoreControlledChecked ? [] : (options.checkedKeys?.source ?? uncontrolledChecked.source),
      ),
      targetCheckedKeys: normalizeChecked(
        'target',
        ignoreControlledChecked ? [] : (options.checkedKeys?.target ?? uncontrolledChecked.target),
      ),
    }
  }

  const store = createStore(deriveSnapshot())

  function itemMap(items: readonly TItem[]) {
    const fields = resolveTransferFieldNames(options.fieldNames)
    return new Map(items.map((item) => [readTransferKey(item, fields), item]))
  }

  function setChecked(
    side: TransferSide,
    keys: readonly TransferKey[],
    reason: 'check' | 'replace' = 'replace',
  ) {
    if (options.disabled) return
    const previous = store.getSnapshot()
    if (side === 'source' && options.checkedKeys?.source === undefined)
      uncontrolledChecked = { ...uncontrolledChecked, source: keys }
    if (side === 'target' && options.checkedKeys?.target === undefined)
      uncontrolledChecked = { ...uncontrolledChecked, target: keys }
    const controlledCheckedKeys = options.checkedKeys
    if (controlledCheckedKeys?.[side] !== undefined) {
      options.checkedKeys = { ...controlledCheckedKeys, [side]: keys }
    }
    const next = deriveSnapshot()
    options.checkedKeys = controlledCheckedKeys
    const previousKeys = side === 'source' ? previous.sourceCheckedKeys : previous.targetCheckedKeys
    const nextKeys = side === 'source' ? next.sourceCheckedKeys : next.targetCheckedKeys
    store.setSnapshot(deriveSnapshot())
    options.onCheckedChange?.(
      { source: next.sourceCheckedKeys, target: next.targetCheckedKeys },
      {
        side,
        reason,
        checkedItems: {
          source: next.sourceCheckedKeys
            .map((key) => itemMap(next.sourceItems).get(key))
            .filter((item): item is TItem => item !== undefined),
          target: next.targetCheckedKeys
            .map((key) => itemMap(next.targetItems).get(key))
            .filter((item): item is TItem => item !== undefined),
        },
        changedKeys: uniqueTransferKeys([...previousKeys, ...nextKeys]).filter(
          (key) => previousKeys.includes(key) !== nextKeys.includes(key),
        ),
        changedItems: uniqueTransferKeys([...previousKeys, ...nextKeys])
          .filter((key) => previousKeys.includes(key) !== nextKeys.includes(key))
          .map((key) => itemMap(options.items).get(key))
          .filter((item): item is TItem => item !== undefined),
      },
    )
  }

  function move(
    action: TransferChangeAction,
    side: TransferSide,
    requestedKeys: readonly TransferKey[],
  ) {
    if (options.disabled) return
    const previous = store.getSnapshot()
    const fields = resolveTransferFieldNames(options.fieldNames)
    const sideItems = side === 'source' ? previous.sourceItems : previous.targetItems
    const sideMap = itemMap(sideItems)
    const movedKeys = uniqueTransferKeys(requestedKeys).filter((key) => {
      const item = sideMap.get(key)
      return item !== undefined && !readTransferDisabled(item, fields)
    })
    if (movedKeys.length === 0) return

    const movedSet = new Set(movedKeys)
    const nextTargetKeys =
      side === 'source'
        ? uniqueTransferKeys([...previous.targetKeys, ...movedKeys])
        : previous.targetKeys.filter((key) => !movedSet.has(key))
    const nextChecked: TransferCheckedKeys = {
      source: side === 'source' ? [] : previous.sourceCheckedKeys,
      target: side === 'target' ? [] : previous.targetCheckedKeys,
    }
    if (options.targetKeys === undefined) uncontrolledTargetKeys = nextTargetKeys
    if (side === 'source' && options.checkedKeys?.source === undefined)
      uncontrolledChecked = { ...uncontrolledChecked, source: [] }
    if (side === 'target' && options.checkedKeys?.target === undefined)
      uncontrolledChecked = { ...uncontrolledChecked, target: [] }

    // Derive callback metadata from the requested controlled result without making
    // core a second source of truth for controlled target or checked values.
    const controlledTargetKeys = options.targetKeys
    const controlledCheckedKeys = options.checkedKeys
    options.targetKeys = nextTargetKeys
    options.checkedKeys = nextChecked
    const next = deriveSnapshot()
    options.targetKeys = controlledTargetKeys
    options.checkedKeys = controlledCheckedKeys
    store.setSnapshot(deriveSnapshot())
    options.onChange?.(nextTargetKeys, {
      action,
      movedKeys,
      movedItems: movedKeys
        .map((key) => sideMap.get(key))
        .filter((item): item is TItem => item !== undefined),
      sourceItems: next.sourceItems,
      targetItems: next.targetItems,
      previousTargetKeys: previous.targetKeys,
      previousTargetItems: previous.targetItems,
    })
    const previousSideChecked =
      side === 'source' ? previous.sourceCheckedKeys : previous.targetCheckedKeys
    if (previousSideChecked.length > 0) {
      options.onCheckedChange?.(nextChecked, {
        side,
        reason: 'move',
        checkedItems: {
          source: next.sourceCheckedKeys
            .map((key) => itemMap(next.sourceItems).get(key))
            .filter((item): item is TItem => item !== undefined),
          target: next.targetCheckedKeys
            .map((key) => itemMap(next.targetItems).get(key))
            .filter((item): item is TItem => item !== undefined),
        },
        changedKeys: previousSideChecked,
        changedItems: previousSideChecked
          .map((key) => sideMap.get(key))
          .filter((item): item is TItem => item !== undefined),
      })
    }
  }

  return {
    getSnapshot: store.getSnapshot,
    subscribe: store.subscribe,
    updateOptions(nextOptions) {
      const previous = store.getSnapshot()
      const previousCheckedOption = options.checkedKeys
      const nextItems = nextOptions.items ?? options.items
      const dataChanged = nextItems !== itemsReference
      Object.assign(options, nextOptions, { items: nextItems })
      if (dataChanged) {
        itemsReference = nextItems
        uncontrolledChecked = { source: [], target: [] }
        ignoreControlledChecked = options.checkedKeys !== undefined
        if (options.targetKeys === undefined) {
          if (!hasResolvedInitialItems && nextItems.length > 0) {
            uncontrolledTargetKeys = uniqueTransferKeys(options.defaultTargetKeys ?? [])
          }
          const fields = resolveTransferFieldNames(options.fieldNames)
          const nextItemKeys = new Set(options.items.map((item) => readTransferKey(item, fields)))
          uncontrolledTargetKeys = uncontrolledTargetKeys.filter((key) => nextItemKeys.has(key))
        }
        if (nextItems.length > 0) hasResolvedInitialItems = true
      } else if (
        nextOptions.checkedKeys !== undefined &&
        nextOptions.checkedKeys !== previousCheckedOption
      ) {
        ignoreControlledChecked = false
      }
      const next = deriveSnapshot()
      store.setSnapshot(next)
      if (
        dataChanged &&
        (previous.targetKeys.length !== next.targetKeys.length ||
          previous.targetKeys.some((key, index) => next.targetKeys[index] !== key))
      ) {
        options.onChange?.(next.targetKeys, {
          action: 'data-change',
          movedKeys: [],
          movedItems: [],
          sourceItems: next.sourceItems,
          targetItems: next.targetItems,
          previousTargetKeys: previous.targetKeys,
          previousTargetItems: previous.targetItems,
        })
      }
      if (
        dataChanged &&
        (previous.sourceCheckedKeys.length > 0 || previous.targetCheckedKeys.length > 0)
      ) {
        const previousItems = itemMap([...previous.sourceItems, ...previous.targetItems])
        const changedKeys = uniqueTransferKeys([
          ...previous.sourceCheckedKeys,
          ...previous.targetCheckedKeys,
        ])
        options.onCheckedChange?.(
          { source: [], target: [] },
          {
            side: null,
            reason: 'data-change',
            checkedItems: { source: [], target: [] },
            changedKeys,
            changedItems: changedKeys
              .map((key) => previousItems.get(key))
              .filter((item): item is TItem => item !== undefined),
          },
        )
      }
    },
    setSourceCheckedKeys: (keys) => setChecked('source', keys),
    setTargetCheckedKeys: (keys) => setChecked('target', keys),
    moveToTarget: () => move('move-to-target', 'source', store.getSnapshot().sourceCheckedKeys),
    moveToSource: () => move('move-to-source', 'target', store.getSnapshot().targetCheckedKeys),
    moveAllToTarget: () => move('move-all-to-target', 'source', store.getSnapshot().sourceKeys),
    moveAllToSource: () => move('move-all-to-source', 'target', store.getSnapshot().targetKeys),
    canMoveToTarget: () => !options.disabled && store.getSnapshot().sourceCheckedKeys.length > 0,
    canMoveToSource: () => !options.disabled && store.getSnapshot().targetCheckedKeys.length > 0,
    canMoveAllToTarget: () =>
      !options.disabled &&
      store
        .getSnapshot()
        .sourceItems.some(
          (item) => !readTransferDisabled(item, resolveTransferFieldNames(options.fieldNames)),
        ),
    canMoveAllToSource: () =>
      !options.disabled &&
      store
        .getSnapshot()
        .targetItems.some(
          (item) => !readTransferDisabled(item, resolveTransferFieldNames(options.fieldNames)),
        ),
  }
}
