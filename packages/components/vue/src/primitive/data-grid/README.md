# DataGrid primitive（Vue）

Vue 3 Composition API 对 TanStack Table v9 的薄适配，跨框架算法和样式协议与 React/Solid/Svelte/Angular 共用。

## 导入与示例

```vue
<script setup lang="ts">
import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-vue/primitive/data-grid'
import { useDataGridTable } from '@fex/components-vue/composables/use-data-grid-table'
const features = tableFeatures({})
const columns: ColumnDef<typeof features, User>[] = [{ accessorKey: 'name', header: 'Name' }]
const table = useDataGridTable({ features, data: users, columns, getRowId: (row) => row.id })
</script>
<template><DataGrid :table="table" border /></template>
```

## Props

| 参数                                      | 类型                                        | 默认值    | 必填 | 说明                                                                     |
| ----------------------------------------- | ------------------------------------------- | --------- | ---- | ------------------------------------------------------------------------ |
| `table`                                   | `VueDataGridTable`                          | -         | 是   | composable 创建的实例                                                    |
| `density`                                 | `compact/default/comfortable`               | `default` | 否   | 行密度                                                                   |
| `striped` / `border` / `loading`          | `boolean`                                   | `false`   | 否   | 展示状态                                                                 |
| `virtual`                                 | `{ height; estimateRowHeight?; overscan? }` | -         | 否   | 虚拟行                                                                   |
| `getHeaderProps/getCellProps/getRowProps` | callback                                    | -         | 否   | 调用方行为适配                                                           |
| `partClass`                               | 结构化对象                                  | -         | 否   | 各 table part 的 class；使用独立属性避免与 Vue 原生 `class` 合并语义冲突 |

状态与事件沿用 TanStack `state`、`initialState`、`onXxxChange`；本地列通过 `meta.filterFn/sortFn` 声明，缺失函数的列由远程处理。组件提供 cell/group/subcomponent template，编辑与请求状态由调用方管理。固定、分组、resize、border、虚拟滚动和 DnD 行为与 React demo 对齐。
