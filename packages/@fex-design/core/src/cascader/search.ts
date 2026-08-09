import { getCascaderPath, type CascaderModel } from './model'
import type { CascaderFilterOption, CascaderNode } from './types'

function defaultFilter(keyword: string, path: readonly CascaderNode[]): boolean {
  const tokens = keyword.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean)
  const labels = path.map((node) => node.label.toLocaleLowerCase())
  return tokens.every((token) => labels.some((label) => label.includes(token)))
}

export function searchCascaderPaths(
  model: CascaderModel,
  keyword: string,
  filterOption?: boolean | CascaderFilterOption,
): readonly (readonly CascaderNode[])[] {
  if (!keyword.trim()) return []
  const results: CascaderNode[][] = []
  for (const node of model.nodes.values()) {
    if (!node.leaf) continue
    const path = getCascaderPath(model, node.key)
    const matches = filterOption === false
      ? true
      : typeof filterOption === 'function'
        ? filterOption(keyword, path.map((item) => item.option))
        : defaultFilter(keyword, path)
    if (matches) results.push(path)
  }
  return results
}
