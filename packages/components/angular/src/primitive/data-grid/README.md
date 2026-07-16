# DataGrid primitive（Angular）

Angular standalone、Signal-first 的 TanStack Table v9 适配。核心状态订阅由 `createDataGridTableSignal` 负责，DOM 使用独立模板文件。

```ts
import { DataGridComponent } from '@fex/components-angular/primitive/data-grid'
import { createDataGridTableSignal } from '@fex/components-angular/signals/create-data-grid-table'
const features = tableFeatures({})
readonly table = createDataGridTableSignal({ features, data, columns, getRowId: row => row.id })
```

## Inputs / outputs

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `table` | `AngularDataGridTable` | - | 是 | signal helper 创建的实例 |
| `density` | `compact/default/comfortable` | `default` | 否 | 密度 |
| `striped` / `border` / `loading` | `boolean` | `false` | 否 | 展示状态 |
| `virtual` | 虚拟行配置 | - | 否 | 只渲染可视行 |
| `class` | 原生 host class | - | 否 | 自动与默认 class 合并 |
| `partClass` | 结构化对象 | `{}` | 否 | 定制 root、viewport、table、header、body、row、cell 等部件 class |
| `headerAction` / `cellAction` / `rowAction` | `DataGridPartAction` | - | 否 | 将 Sortable 等项目交互绑定到真实表头、单元格或行，并接收对应强类型 item |

单元格、分组行与展开内容通过强类型 template directives 提供；原生交互直接调用 table action 或对应 change handler。受控/非受控状态、feature 注册、本地/远程列、固定、分组、resize、编辑、虚拟化与 DnD 示例顺序和 React 一致。
