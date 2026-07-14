export type DepartmentNode = {
  id: string
  name: string
  childCount: number
  disabled?: boolean
  childrenList?: DepartmentNode[]
}

export const departmentFieldNames = { key: 'id', title: 'name', children: 'childrenList' } as const
export function isDepartmentLeaf(node: DepartmentNode) {
  return (node.childrenList?.length ?? node.childCount) === 0
}
export const departmentTreeData: DepartmentNode[] = [{
  id: 'company', name: 'Fex Admin', childCount: 3, childrenList: [
    { id: 'engineering', name: 'Engineering', childCount: 2, childrenList: [
      { id: 'frontend', name: 'Frontend', childCount: 0 },
      { id: 'platform', name: 'Platform', childCount: 0 },
    ] },
    { id: 'product', name: 'Product', childCount: 2, childrenList: [
      { id: 'research', name: 'Research', childCount: 0 },
      { id: 'design', name: 'Design', childCount: 0, disabled: true },
    ] },
    { id: 'finance', name: 'Finance', childCount: 0 },
  ],
}]
export function createLargeTreeData(count = 5000): DepartmentNode[] {
  return [{ id: 'large-root', name: 'Large root', childCount: count, childrenList: Array.from({ length: count }, (_, index) => ({ id: `large-${index}`, name: `Virtual row ${index + 1}`, childCount: 0 })) }]
}
