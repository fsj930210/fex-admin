# Badge Primitive

## 用途

`Badge` 用于状态、分类、标签和短计数展示。Primitive 层保持轻量，不内置业务映射。

## 导入路径

```tsx
import { Badge } from '@fex/components-react/primitive/badge'
```

## 核心示例

```tsx
import { Badge } from '@fex/components-react/primitive/badge'

export function Demo() {
  return <Badge variant="secondary">Pending</Badge>
}
```

## Props

| 参数名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `variant` | `'default' \| 'secondary' \| 'destructive' \| 'outline' \| 'ghost' \| 'link'` | `'default'` | 否 | 徽标视觉语义。 |
| `className` | `string` | `undefined` | 否 | 合并到根元素的 class。 |
| `children` | `ReactNode` | `undefined` | 否 | 徽标内容。 |

## 事件/回调

继承 `span` 原生事件。若需要可点击语义，应在业务侧选择合适元素或使用 UI 层封装。

## 受控/非受控

无内部状态。

## 注意事项

内容应保持简短，避免把长句放入 Badge。

## 常见组合

常与表格状态列、卡片标题区和筛选条件摘要组合。
