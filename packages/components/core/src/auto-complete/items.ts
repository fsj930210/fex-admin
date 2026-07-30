import type {
  AutoCompleteControllerOptions,
  AutoCompleteItem,
  AutoCompleteKey,
  ResolvedAutoCompleteItem,
} from './types'

const defaultFieldNames = {
  key: 'key',
  value: 'value',
  label: 'label',
  disabled: 'disabled',
} as const

export function resolveAutoCompleteItems<TItem>(
  options: Pick<AutoCompleteControllerOptions<TItem>, 'items' | 'fieldNames'>,
): ResolvedAutoCompleteItem<TItem>[] {
  const fields = { ...defaultFieldNames, ...options.fieldNames } as Record<
    keyof typeof defaultFieldNames,
    keyof TItem
  >
  return (options.items ?? []).map((item) => {
    const value = item[fields.value] as string
    return {
      item,
      key: item[fields.key] as AutoCompleteKey,
      value,
      label: (item[fields.label] as string | undefined) ?? value,
      disabled: (item[fields.disabled] as boolean | undefined) === true,
    }
  })
}

export function filterAutoCompleteItems<TItem>(
  items: readonly ResolvedAutoCompleteItem<TItem>[],
  keyword: string,
  filterOption: AutoCompleteControllerOptions<TItem>['filterOption'],
) {
  if (filterOption === false) return items
  if (typeof filterOption === 'function') {
    return items.filter((entry) => filterOption(keyword, entry.item))
  }
  const normalized = keyword.trim().toLocaleLowerCase()
  if (!normalized) return items
  return items.filter((entry) => entry.value.toLocaleLowerCase().includes(normalized))
}

export type { AutoCompleteItem }
