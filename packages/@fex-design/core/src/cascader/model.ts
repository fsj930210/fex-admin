import type {
  CascaderFieldNames,
  CascaderNode,
  CascaderOption,
  CascaderPathValue,
  CascaderPrimitive,
  ResolvedCascaderFieldNames,
} from './types'

export const defaultCascaderFieldNames: ResolvedCascaderFieldNames = {
  value: 'value',
  label: 'label',
  children: 'children',
  disabled: 'disabled',
  isLeaf: 'isLeaf',
}

export function resolveCascaderFieldNames(
  fields?: CascaderFieldNames,
): ResolvedCascaderFieldNames {
  return {
    value: fields?.value ?? defaultCascaderFieldNames.value,
    label: fields?.label ?? defaultCascaderFieldNames.label,
    children: fields?.children ?? defaultCascaderFieldNames.children,
    disabled: fields?.disabled ?? defaultCascaderFieldNames.disabled,
    isLeaf: fields?.isLeaf ?? defaultCascaderFieldNames.isLeaf,
  }
}

export function createCascaderPathKey(values: CascaderPathValue): string {
  return JSON.stringify(values)
}

export interface CascaderModel {
  roots: readonly CascaderNode[]
  nodes: ReadonlyMap<string, CascaderNode>
  children: ReadonlyMap<string, readonly CascaderNode[]>
}

export function createCascaderModel(
  options: readonly CascaderOption[],
  fieldNames?: CascaderFieldNames,
  _lazy = false,
): CascaderModel {
  const fields = resolveCascaderFieldNames(fieldNames)
  const nodes = new Map<string, CascaderNode>()
  const children = new Map<string, readonly CascaderNode[]>()

  function visit(
    items: readonly CascaderOption[],
    parent: CascaderNode | undefined,
  ): CascaderNode[] {
    const result: CascaderNode[] = []
    for (const option of items) {
      const rawValue = option[fields.value]
      if (typeof rawValue !== 'string' && typeof rawValue !== 'number') continue
      const value = rawValue as CascaderPrimitive
      const pathValues = [...(parent?.pathValues ?? []), value]
      const key = createCascaderPathKey(pathValues)
      const rawChildren = option[fields.children]
      const childOptions = Array.isArray(rawChildren)
        ? (rawChildren as CascaderOption[])
        : undefined
      const node: CascaderNode = {
        key,
        value,
        label: String(option[fields.label] ?? value),
        option,
        parentKey: parent?.key,
        depth: parent ? parent.depth + 1 : 0,
        pathKeys: [...(parent?.pathKeys ?? []), key],
        pathValues,
        disabled: option[fields.disabled] === true,
        leaf: option[fields.isLeaf] !== false && !childOptions?.length,
      }
      nodes.set(key, node)
      result.push(node)
      if (childOptions?.length) children.set(key, visit(childOptions, node))
    }
    return result
  }

  return { roots: visit(options, undefined), nodes, children }
}

export function getCascaderPath(model: CascaderModel, key: string): CascaderNode[] {
  const node = model.nodes.get(key)
  if (!node) return []
  return node.pathKeys.flatMap((pathKey) => {
    const item = model.nodes.get(pathKey)
    return item ? [item] : []
  })
}

export function getCascaderDescendants(model: CascaderModel, key: string): CascaderNode[] {
  const result: CascaderNode[] = []
  const visit = (parentKey: string) => {
    for (const child of model.children.get(parentKey) ?? []) {
      result.push(child)
      visit(child.key)
    }
  }
  visit(key)
  return result
}
