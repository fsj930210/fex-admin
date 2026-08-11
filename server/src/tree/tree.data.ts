import type { DepartmentNode } from './tree.types.js'

export const departmentTree: DepartmentNode[] = [
  {
    id: 'company',
    name: 'Fex Company',
    childCount: 3,
    children: [
      {
        id: 'engineering',
        name: 'Engineering',
        childCount: 3,
        children: [
          { id: 'frontend', name: 'Frontend', childCount: 0 },
          { id: 'platform', name: 'Platform', childCount: 0 },
          { id: 'engineering-operations', name: 'Operations', childCount: 0 },
        ],
      },
      {
        id: 'finance',
        name: 'Finance',
        childCount: 2,
        children: [
          { id: 'accounting', name: 'Accounting', childCount: 0 },
          { id: 'finance-operations', name: 'Operations', childCount: 0 },
        ],
      },
      {
        id: 'product',
        name: 'Product',
        childCount: 2,
        children: [
          { id: 'design-system', name: 'Design System', childCount: 0 },
          { id: 'research', name: 'Research', childCount: 0, disabled: true },
        ],
      },
    ],
  },
]
