import type {
  TransferDataItem,
  TransferFieldNames,
  TransferKey,
  TransferResolvedFieldNames,
} from './types'

export function resolveTransferFieldNames(fieldNames?: TransferFieldNames): TransferResolvedFieldNames {
  return {
    key: fieldNames?.key ?? 'key',
    label: fieldNames?.label ?? 'label',
    disabled: fieldNames?.disabled ?? 'disabled',
  }
}

export function readTransferKey(item: TransferDataItem, fieldNames: TransferResolvedFieldNames): TransferKey {
  const key = item[fieldNames.key]
  if (typeof key !== 'string' && typeof key !== 'number') {
    throw new TypeError(`Transfer item field "${fieldNames.key}" must be a string or number.`)
  }
  return key
}

export function readTransferDisabled(item: TransferDataItem, fieldNames: TransferResolvedFieldNames): boolean {
  return item[fieldNames.disabled] === true
}

export function uniqueTransferKeys(keys: readonly TransferKey[]): TransferKey[] {
  return Array.from(new Set(keys))
}
