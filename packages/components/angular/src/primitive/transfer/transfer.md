# Transfer

`Transfer` 在两个内置 panel 之间移动有序数据，默认 body 复用 primitive Listbox。组件只提供 primitive 层。

## 导入与基础用法

```ts
import {
  Transfer,
  TransferActionsTemplate,
  TransferItemTemplate,
  TransferPanelTemplate,
} from '@fex/components-angular/primitive/transfer'
```

```html
<fex-transfer
  [items]="members"
  [fieldNames]="{ key: 'id', label: 'name', disabled: 'disabled' }"
  [defaultTargetKeys]="['grace']"
  (transferChange)="handleChange($event)"
/>
```

## Inputs

| Input | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `readonly TItem[]` | 必填 | 完整数据；数据引用变化会清空临时勾选。 |
| `fieldNames` | `TransferFieldNames` | 标准字段 | 映射 key、label、disabled。 |
| `targetKeys` / `defaultTargetKeys` | `readonly TransferKey[]` | — / `[]` | 受控值与非受控初始值。 |
| `checkedKeys` / `defaultCheckedKeys` | `Partial<TransferCheckedKeys>` | — / `{}` | 两侧受控与非受控勾选。 |
| `disabled` | `boolean` | `false` | 禁止勾选和所有移动。 |
| `title` | `{ source?, target? }` | Source/Target | 默认 panel 标题。 |
| `validation` | `{ status, message }` | — | error 或 warning 展示。 |

`targetKeysChange` 与 `checkedKeysChange` 便于双向受控；`transferChange` 与 `transferCheckedChange` 额外返回完整 meta 和 items。

## 自定义区域

`ng-template fexTransferPanel="source|target" region="header|body|footer"` 分别定制两侧区域；`fexTransferItem` 定制默认 Listbox item；`fexTransferActions` 定制动作组合。

Panel context 提供 `items`、`checkedKeys`、`setCheckedKeys`、`isChecked` 与同一个 `controller`。Actions context 提供 controller 及四个响应式 `canMove...` 状态。Tree/DataGrid 只需绑定 panel 选择状态，移动仍由 Transfer controller 负责。

受控模式必须在 `targetKeysChange` 中回写值。disabled item 会保留在当前 panel，并从勾选及全部移动操作中排除。
