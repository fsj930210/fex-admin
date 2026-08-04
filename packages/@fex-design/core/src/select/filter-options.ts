import type { SelectionValue } from '../selection/types'
import type { SelectFilterOption, SelectOption } from './types'

function normalizeSearchText(value: string) {
  return value.trim().toLocaleLowerCase()
}

export const defaultSelectFilterOption: SelectFilterOption = (keyword, option) => {
  const normalizedKeyword = normalizeSearchText(keyword)
  if (!normalizedKeyword) return true
  const haystack = [option.searchText ?? option.label, ...(option.keywords ?? [])]
  return haystack.some((value) => normalizeSearchText(value).includes(normalizedKeyword))
}

export function filterSelectOptions<TValue extends SelectionValue>(
  options: readonly SelectOption<TValue>[],
  keyword: string,
  filterOption?: SelectFilterOption<TValue>,
) {
  if (!filterOption || !keyword) return options
  return options.filter((option) => filterOption(keyword, option))
}

export function groupSelectOptions<TValue extends SelectionValue>(
  options: readonly SelectOption<TValue>[],
) {
  const groups = new Map<string | undefined, SelectOption<TValue>[]>()
  for (const option of options) {
    const items = groups.get(option.group) ?? []
    items.push(option)
    groups.set(option.group, items)
  }
  return Array.from(groups, ([label, items]) => ({ label, options: items }))
}
