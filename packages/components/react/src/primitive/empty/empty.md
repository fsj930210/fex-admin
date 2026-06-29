# Empty Primitive

## 用途

`Empty` 用于空列表、空搜索结果和空筛选结果。Primitive 层只提供结构和 slot，不内置业务按钮。

## 导入路径

```tsx
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@fex/components-react/primitive/empty'
```

## 核心示例

```tsx
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@fex/components-react/primitive/empty'

export function Demo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon" />
        <EmptyTitle>暂无数据</EmptyTitle>
        <EmptyDescription>调整筛选条件后再试。</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
```

## Props

| 参数名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `variant` | `'default' \| 'icon'` | `'default'` | 否 | 仅 `EmptyMedia` 支持，控制媒体区域样式。 |
| `className` | `string` | `undefined` | 否 | 合并到对应 slot 的 class。 |
| `children` | `ReactNode` | `undefined` | 否 | 空状态内容。 |

## 事件/回调

继承对应原生元素事件。组件本身不定义业务回调。

## 受控/非受控

无内部状态。

## 注意事项

行动按钮建议放在 `EmptyContent` 中，避免把复杂业务流写进 primitive。

## 常见组合

`EmptyHeader` 承载图标、标题和说明；`EmptyContent` 承载按钮、链接或状态徽标。
