# Alert Primitive

## 用途

`Alert` 用于展示需要用户注意的状态信息。Primitive 层只提供结构、slot、可访问语义和默认样式，不处理关闭、请求或业务状态。

## 导入路径

```tsx
import { Alert, AlertDescription, AlertTitle } from '@fex/components-react/primitive/alert'
```

## 核心示例

```tsx
import { Alert, AlertDescription, AlertTitle } from '@fex/components-react/primitive/alert'

export function Demo() {
  return (
    <Alert variant="warning">
      <AlertTitle>配置未完成</AlertTitle>
      <AlertDescription>请补充必要字段后再提交。</AlertDescription>
    </Alert>
  )
}
```

## Props

| 参数名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `variant` | `'default' \| 'destructive' \| 'success' \| 'warning' \| 'info'` | `'default'` | 否 | 提示语义样式。 |
| `className` | `string` | `undefined` | 否 | 合并到根元素或子 slot 的 class。 |
| `children` | `ReactNode` | `undefined` | 否 | 提示内容。 |

## 事件/回调

继承对应原生元素事件，例如 `onClick`、`onMouseEnter`。组件本身不定义业务回调。

## 受控/非受控

无内部状态，不区分受控和非受控。

## 注意事项

根元素默认带 `role="alert"`。如果提示不需要即时被辅助技术朗读，可按场景覆盖 `role`。

## 常见组合

可与图标、操作区和文本 slot 组合使用：`AlertTitle` 放标题，`AlertDescription` 放说明，`AlertAction` 放右上角操作。
