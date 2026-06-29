# Pagination Primitive

## 用途

`Pagination` 提供分页的可访问结构和基础样式，不内置页码计算或远程请求逻辑。

## 导入路径

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@fex/components-react/primitive/pagination'
```

## 核心示例

```tsx
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@fex/components-react/primitive/pagination'

export function Demo() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink href="#1" isActive>
            1
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
```

## Props

| 参数名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `isActive` | `boolean` | `false` | 否 | 仅 `PaginationLink` 支持，标记当前页。 |
| `size` | `'default' \| 'icon'` | `'icon'` | 否 | 仅 `PaginationLink` 支持，控制链接尺寸。 |
| `text` | `string` | `'Previous'` / `'Next'` | 否 | 上一页、下一页展示文本。 |
| `className` | `string` | `undefined` | 否 | 合并到对应 slot 的 class。 |

## 事件/回调

继承原生链接事件。分页变化建议在点击事件或路由跳转中处理，不通过 effect 监听页码补请求。

## 受控/非受控

无内部页码状态。当前页由调用方通过 `isActive` 控制。

## 注意事项

页码生成、边界禁用和数据请求应放在业务层、service 或 UI 层封装中。

## 常见组合

常与表格、列表、筛选条件和远程请求 service 组合。
