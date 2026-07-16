# DataGrid primitive（Solid）

Solid 适配使用 signal 订阅 TanStack v9 实例，渲染与布局规则来自共享 core/styles。

```tsx
import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-solid/primitive/data-grid'
import { createDataGridTable } from '@fex/components-solid/primitives/create-data-grid-table'
const features = tableFeatures({})
const table = createDataGridTable({ features, data, columns, getRowId: row => row.id })
return <DataGrid table={table} border />
```

## Props

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `table` | `SolidDataGridTable` | - | 是 | primitive 创建的实例 |
| `density` | `compact/default/comfortable` | `default` | 否 | 密度 |
| `striped` / `border` / `loading` | `boolean` | `false` | 否 | 展示状态 |
| `virtual` | 虚拟行配置 | - | 否 | 只渲染可视行 |
| `getHeaderProps/getCellProps/getRowProps` | callback | - | 否 | 连接 Sortable/原生属性 |
| `class` | 结构化对象 | - | 否 | part class |

受控/非受控状态、feature 注册、本地与远程列判定均保持 TanStack 语义。用户动作直接调用 table action/change 回调，不用 effect 串联。选择、展开、分页、可见性、固定、分组、resize、编辑与 DnD 示例和 React 一一对应。
