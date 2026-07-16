# DataGrid primitive（React）

React 19 对 TanStack Table v9 的薄适配。表格状态、row model 与 feature 来自 TanStack；跨框架的布局、固定区域、远程透传和渲染投影来自 `@fex/components-core`；React 层只负责稳定列定义、订阅实例和渲染语义化表格 DOM。

## 导入

```tsx
import {
  DataGrid,
  tableFeatures,
  useDataGridTable,
  type ColumnDef,
} from '@fex/components-react/primitive/data-grid'
```

```tsx
const features = tableFeatures({})
const columns: ColumnDef<typeof features, User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
]

function UsersGrid({ data }: { data: User[] }) {
  const table = useDataGridTable({ features, data, columns, getRowId: row => row.id })
  return <DataGrid table={table} border />
}
```

调用方无需用 `useMemo` 包 columns；`useDataGridTable` 会按列结构稳定引用，同时让 header/cell/meta 回调读取最新实现。`getRowId` 必填，不能用数组下标替代业务主键。

## Props

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `table` | `ReactTable<TFeatures, TData>` | - | 是 | `useDataGridTable` 创建的 v9 实例 |
| `density` | `'compact' \| 'default' \| 'comfortable'` | `'default'` | 否 | 行密度 |
| `striped` | `boolean` | `false` | 否 | 斑马纹 |
| `border` | `boolean` | `false` | 否 | 展示完整单元格网格；开启后不重复画普通分隔符 |
| `loading` | `boolean` | `false` | 否 | loading 覆盖层 |
| `loadingContent` | `ReactNode` | `'Loading…'` | 否 | loading 内容 |
| `emptyContent` | `ReactNode` | `'No data'` | 否 | 空状态内容 |
| `virtual` | `{ height; estimateRowHeight?; overscan? }` | - | 否 | 行虚拟滚动 |
| `renderSubComponent` | `(row) => ReactNode` | - | 否 | 展开详情行 |
| `renderGroupRow` | `(row) => ReactNode` | - | 否 | 跨全部可见列的分组摘要行 |
| `getHeaderProps` | `(header) => th props` | - | 否 | 连接拖拽等调用方行为 |
| `getCellProps` | `(cell) => td props` | - | 否 | 连接 motion/ref/style |
| `getRowProps` | `(row) => tr props` | - | 否 | 连接行拖拽或测试属性 |
| `className` | `DataGridClassName` | - | 否 | root/viewport/table/header/body/row/cell 等结构化 class |

## 状态与事件

排序、筛选、分页、选择等使用 TanStack 原生 `state` 与 `onXxxChange`。受控状态必须成对传入；非受控状态使用 `initialState`。请求应直接在 change 事件链处理，不要再用 effect 监听表格状态。

本地/远程排序与筛选不使用 `mode`：列 `meta.sortFn` / `meta.filterFn` 存在即本地执行，缺失即保留完整状态但使用远程透传 comparator/filter。分页是表级互斥能力：客户端分页注册 paginated row model，服务端分页使用 manual pagination 与 rowCount。

## Feature 与组合

每个能力从 `@fex/components-core/data-grid/features/*` 独立导入：sorting、filtering、client/server pagination、selection、expansion、visibility、ordering、column/row pinning、sizing/resizing、grouping。选择列、展开列、排序按钮、筛选输入、分页和可见性控制均从同一 primitive 入口按需导入。

列 DnD 与行 DnD 不绑定到 DataGrid 策略；调用方使用项目 Sortable，并通过 part props 连接。固定列、固定行、表头分组、宽度和边界样式均使用 core 与 `@fex/components-styles/data-grid`，其它框架共享同一规则。

## 注意事项

- 固定列需要 sizing feature 提供确定偏移；表格 resize 时宽度使用 total size，否则为 `100%`。
- 嵌套 columns 直接渲染 TanStack header groups、placeholder 和 `colSpan`，不会把未分组叶子合并成一个假分组。
- 行固定与列固定是 opaque sticky layer，只在区域边缘绘制方向对应的阴影。
- 编辑状态属于应用数据；primitive 不维护隐藏的数据副本。
- 虚拟滚动只挂载可视行；动态详情高度、row pinning 等组合要提供经过验证的估算策略。
