import type {
  TransferDataItem,
  TransferFieldNames,
  TransferKey,
  TransferResolvedFieldNames,
} from './types'

export function resolveTransferFieldNames(
  fieldNames?: TransferFieldNames,
): TransferResolvedFieldNames {
  return {
    key: fieldNames?.key ?? 'key',
    label: fieldNames?.label ?? 'label',
    disabled: fieldNames?.disabled ?? 'disabled',
  }
}

export function readTransferKey(
  item: unknown,
  fieldNames: TransferResolvedFieldNames,
): TransferKey {
  const key =
    item && typeof item === 'object' ? (item as TransferDataItem)[fieldNames.key] : undefined
  if (typeof key !== 'string' && typeof key !== 'number') {
    throw new TypeError(`Transfer item field "${fieldNames.key}" must be a string or number.`)
  }
  return key
}

export function readTransferDisabled(
  item: unknown,
  fieldNames: TransferResolvedFieldNames,
): boolean {
  return Boolean(
    item && typeof item === 'object' && (item as TransferDataItem)[fieldNames.disabled] === true,
  )
}

export function uniqueTransferKeys(keys: readonly TransferKey[]): TransferKey[] {
  return Array.from(new Set(keys))
}
