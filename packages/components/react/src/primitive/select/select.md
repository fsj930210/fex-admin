# React Select primitives

Select 提供单选、`multiple` 多选和 `mode="tags"`。`SelectTrigger` 是完整的输入型触发器，内部管理搜索 input、Value、互斥 suffix（Loading、Clear、下拉图标）；`SelectValue` 表示完整 value 区域，可整体替换。

## 导入

```tsx
import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex/components-react/primitive/select'
```

## 基础示例

```tsx
<SelectRoot options={options} defaultValue="react" clearable>
  <SelectTrigger placeholder="请选择" />
  <SelectContent>
    <SelectList />
  </SelectContent>
</SelectRoot>
```

`multiple` 返回数组；`mode="tags"` 同时启用多选和输入创建。传入 `filterOption` 时执行本地过滤；无 `filterOption` 而使用 `onSearch` 时由调用方更新远程 options。两种搜索都会调用 `onSearch(keyword)`。

## 主要 Props

| Props                | 类型                                 | 说明                                      |
| -------------------- | ------------------------------------ | ----------------------------------------- |
| `options`            | `SelectOption[]`                     | 稳定 value 的选项列表。                   |
| `value/defaultValue` | `SelectionValue \| SelectionValue[]` | 受控或非受控值。                          |
| `multiple`           | `boolean`                            | 多选模式。                                |
| `mode`               | `'tags'`                             | 可输入创建的多选模式。                    |
| `showSearch`         | `boolean`                            | 开启可编辑搜索 input；Tags 模式自动开启。 |
| `filterOption`       | `(keyword, option) => boolean`       | 本地过滤。                                |
| `onSearch`           | `(keyword) => void`                  | 本地、远程搜索统一通知。                  |
| `clearable`          | `boolean`                            | 在 suffix 位置显示清除按钮。              |
| `virtual`            | `{ itemHeight, overscan? }`          | 固定行高虚拟滚动。                        |
| `maxCount`           | `number`                             | 多选或 Tags 模式允许的最大实际选择数量。  |
| `status`             | `'error' \| 'warning'`               | 表单校验视觉和 ARIA 状态。                |

`SelectTrigger.maxTagCount` 控制多选时最多展示的 Tag 数量，超出部分显示为 `+N`；该属性只影响展示，不改变完整选择值。

`SelectTrigger.prefix` 添加前缀，`suffix` 替换默认下拉箭头；Loading 和 Clear 状态仍优先占用 suffix。`tagRender` 自定义每个多选值，`SelectList.optionRender` 自定义选项内容。

`SelectContent.popupRender(menu, { close })` 用于包裹完整默认菜单并加入输入框、操作按钮等扩展内容。扩展内容默认保持面板打开，需要关闭时显式调用 `close()`。

`onChange(value, meta)` 的 meta 包含 `selectedItem`、`selectedItems`、`previousSelectedValues` 和 `changedValues`。Option 的 `data` 可携带后端所需的额外字段；Tags 创建值会生成 `{ value, label }` 形式的完整 option。

面板默认与 Trigger 等宽；可通过 `--select-content-width`、`--select-content-min-width`、`--select-content-max-width`、`--select-content-max-height` 和 Floating 提供的 available/trigger CSS 变量覆盖。disabled 已选值不会被 Clear 或 Backspace 删除。
