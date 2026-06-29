# Table Primitive

## 用途

`Table` 提供基础表格结构、横向滚动容器和 slot 样式，不内置排序、选择、分页或远程数据。

## 导入路径

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@fex/components-react/primitive/table'
```

## 核心示例

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@fex/components-react/primitive/table'

export function Demo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Invoice</TableCell>
          <TableCell>Paid</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
```

## Props

| 参数名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `className` | `string` | `undefined` | 否 | 合并到对应表格元素的 class。 |
| `children` | `ReactNode` | `undefined` | 否 | 表格内容。 |

## 事件/回调

继承对应原生元素事件。行点击、排序点击等应在明确事件回调中处理。

## 受控/非受控

无内部状态。选中、排序、分页等状态由调用方管理。

## 注意事项

可变列表必须使用稳定 key。复杂表格能力应在 UI/pro 层按需组合。

## 常见组合

可与 `Pagination`、筛选表单、Badge 状态列和远程 service 组合。
