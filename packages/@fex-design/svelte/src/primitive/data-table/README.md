# DataTable primitive（Svelte）

Svelte 5 适配通过 store 订阅 TanStack Table v9，共享 core 布局、固定区域与样式模块。

```svelte
<script lang="ts">
  import { DataTable, DataTablePagination, tableFeatures, type ColumnDef } from '@fex-design/svelte/primitive/data-table'
  import { createDataTable } from '@fex-design/svelte/stores/create-data-table'
  const features = tableFeatures({})
  const table = createDataTable({ features, data, columns, getRowId: row => row.id })
</script>
<DataTable {table} border />
<DataTablePagination {table} pageSizeOptions={[5, 10, 20]} />
```

## Props

| 参数                                | 类型                          | 默认值    | 必填 | 说明                    |
| ----------------------------------- | ----------------------------- | --------- | ---- | ----------------------- |
| `table`                             | `SvelteDataTable`         | -         | 是   | store helper 创建的实例 |
| `density`                           | `compact/default/comfortable` | `default` | 否   | 密度                    |
| `striped` / `border` / `loading`    | `boolean`                     | `false`   | 否   | 展示状态                |
| `virtual`                           | 虚拟行配置                    | -         | 否   | TanStack Virtual        |
| `cell/groupRow/subComponent`        | `Snippet`                     | -         | 否   | 自定义渲染              |
| `headerAction/cellAction/rowAction` | action                        | -         | 否   | 连接项目 Sortable       |
| `class`                             | 结构化对象                    | -         | 否   | part class              |

`DataTablePagination` 是独立 primitive，直接消费同一个 table store。它提供页码、每页条数、选中/总行数摘要和首页/上一页/下一页/末页操作；远程分页仍由调用方通过 TanStack 的受控 `pagination` 状态和 change handler 更新数据。

更新受控 state 时在事件回调里调用 `setDataTableOptions`；编辑状态保存在应用数据。feature、本地/远程判定、固定阴影、header groups、border 与所有 demo 分支和 React 保持一致。
