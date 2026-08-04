# Badge UI

## 用途

`Badge` 用于状态、分类、标签和短计数展示，不内置业务映射。

## 导入路径

```tsx
import { Badge } from '@fex-design/react/ui/badge'
```

## 核心示例

```tsx
<Badge variant="secondary">Pending</Badge>
```

## Props

| 参数        | 类型                                                                          | 默认值      | 必填 | 说明                   |
| ----------- | ----------------------------------------------------------------------------- | ----------- | ---- | ---------------------- |
| `variant`   | `'default' \| 'secondary' \| 'destructive' \| 'outline' \| 'ghost' \| 'link'` | `'default'` | 否   | 徽标视觉语义。         |
| `className` | `string`                                                                      | `undefined` | 否   | 合并到根元素的 class。 |
| `children`  | `ReactNode`                                                                   | `undefined` | 否   | 徽标内容。             |

## 事件与状态

组件继承 `span` 原生属性与事件，没有受控状态。需要可点击语义时应使用合适的交互元素。
