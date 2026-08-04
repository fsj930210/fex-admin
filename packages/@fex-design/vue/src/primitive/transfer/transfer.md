# Transfer

`Transfer` 在两个内置 panel 之间移动有序数据，默认 body 复用 primitive Listbox。组件只提供 primitive 层，不存在 `ui/transfer`。

## 导入

```ts
import { Transfer } from '@fex-design/vue/primitive/transfer'
```

## 基础用法

```vue
<Transfer
  :items="members"
  :field-names="{ key: 'id', label: 'name', disabled: 'disabled' }"
  :default-target-keys="['grace']"
  @change="(keys, meta) => console.log(keys, meta.targetItems)"
/>
```

## Props

| Prop                 | 类型                           | 默认值        | 说明                                   |
| -------------------- | ------------------------------ | ------------- | -------------------------------------- |
| `items`              | `readonly TItem[]`             | 必填          | 完整数据；数据引用变化会清空临时勾选。 |
| `fieldNames`         | `TransferFieldNames`           | 标准字段      | 映射 key、label、disabled。            |
| `targetKeys`         | `readonly TransferKey[]`       | —             | 受控目标 keys，顺序即目标侧顺序。      |
| `defaultTargetKeys`  | `readonly TransferKey[]`       | `[]`          | 非受控初始目标 keys。                  |
| `checkedKeys`        | `Partial<TransferCheckedKeys>` | —             | 受控两侧勾选。                         |
| `defaultCheckedKeys` | `Partial<TransferCheckedKeys>` | `{}`          | 非受控初始勾选。                       |
| `disabled`           | `boolean`                      | `false`       | 禁止勾选和全部移动操作。               |
| `title`              | `{ source?, target? }`         | Source/Target | 两侧默认标题。                         |
| `panels`             | `TransferPanels`               | `{}`          | 控制内置 header/footer region。        |
| `validation`         | `{ status, message }`          | —             | error 或 warning 展示。                |

## 事件

`change(keys, meta)` 返回目标 keys 和完整移动信息；`checkedChange(keys, meta)` 返回两侧勾选与变更 items。不要只依赖单个 key。

## 自定义区域

使用 `sourceHeader`、`sourceBody`、`sourceFooter`、`targetHeader`、`targetBody`、`targetFooter`、`actions` 和 `item` slots。Panel slot 的 `api` 提供 `items`、`checkedKeys`、`setCheckedKeys`、`isChecked` 与同一个 `controller`；actions slot 同时提供 `controller` 和响应式 `snapshot`。Tree/DataTable 只需把选择状态绑定到 panel API，移动仍由 Transfer controller 负责。

受控模式必须在 `change` 中回写 `targetKeys`。disabled item 会保留在当前 panel，并从勾选及所有移动操作中排除。
