import type { SelectionValue } from '../selection/types'
import type { SelectFilterOption, SelectOption } from './types'
import { filterBySearchText, matchSearchText } from '../search/filter-by-search-text'

export const defaultSelectFilterOption: SelectFilterOption = (keyword, option) => {
  const haystack = [option.searchText ?? option.label, ...(option.keywords ?? [])]
  return matchSearchText(keyword, haystack)
}

export function filterSelectOptions<TValue extends SelectionValue>(
  options: readonly SelectOption<TValue>[],
  keyword: string,
  filterOption?: SelectFilterOption<TValue>,
) {
  if (!filterOption || !keyword) return options
  return filterOption === defaultSelectFilterOption
    ? filterBySearchText(options, keyword, (option) => [
        option.searchText ?? option.label,
        ...(option.keywords ?? []),
      ])
    : options.filter((option) => filterOption(keyword, option))
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
