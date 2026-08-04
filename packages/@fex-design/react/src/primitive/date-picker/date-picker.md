# DatePicker

DatePicker primitive 组合 Input、Popover 和 Calendar。输入框只负责展示和解析 string，`value` 与 `onChange` 始终使用 `CalendarValue` 语义值，调用方可通过 `@fex-design/core/date-picker/value` 与 `@fex-design/core/date/utils` 转换为接口需要的字符串或时间戳。

## 导入

```tsx
import {
  DatePickerRoot,
  DatePickerTrigger,
  DatePickerContent,
  DatePickerPanel,
  RangePickerRoot,
  RangePickerTrigger,
  RangePickerContent,
  RangePickerPanelGroup,
} from '@fex-design/react/primitive/date-picker'
```

## 基础用法

```tsx
import {
  DatePickerContent,
  DatePickerPanel,
  DatePickerRoot,
  DatePickerTrigger,
} from '@fex-design/react/primitive/date-picker'

export function Demo() {
  return (
    <DatePickerRoot picker="date">
      <DatePickerTrigger placeholder="请选择日期" />
      <DatePickerContent>
        <DatePickerPanel />
      </DatePickerContent>
    </DatePickerRoot>
  )
}
```

## RangePicker

```tsx
import {
  RangePickerContent,
  RangePickerPanelGroup,
  RangePickerRoot,
  RangePickerTrigger,
} from '@fex-design/react/primitive/date-picker'

export function Demo() {
  return (
    <RangePickerRoot allowEmpty={{ end: true }}>
      <RangePickerTrigger startPlaceholder="Start Date" endPlaceholder="Till Now" />
      <RangePickerContent>
        <RangePickerPanelGroup />
      </RangePickerContent>
    </RangePickerRoot>
  )
}
```

## Props

| 参数名         | 类型                                                 | 默认值         | 必填 | 说明                                         |
| -------------- | ---------------------------------------------------- | -------------- | ---- | -------------------------------------------- |
| `picker`       | `'date' \| 'week' \| 'month' \| 'quarter' \| 'year'` | `'date'`       | 否   | 选择粒度。                                   |
| `value`        | `CalendarValue \| CalendarValue[] \| null`           | -              | 否   | 受控值，多选时为数组。                       |
| `defaultValue` | `CalendarValue \| CalendarValue[] \| null`           | `null`         | 否   | 非受控初始值。                               |
| `multiple`     | `boolean`                                            | `false`        | 否   | DatePicker 多选。                            |
| `needConfirm`  | `boolean`                                            | `multiple`     | 否   | 是否需要确认后提交。                         |
| `open`         | `boolean`                                            | -              | 否   | 受控 Popover 打开状态。                      |
| `defaultOpen`  | `boolean`                                            | `false`        | 否   | 非受控打开初始值。                           |
| `minDate`      | `CalendarDate`                                       | -              | 否   | 最小可选日期。                               |
| `maxDate`      | `CalendarDate`                                       | -              | 否   | 最大可选日期。                               |
| `disabledDate` | `(date: CalendarDate) => boolean`                    | -              | 否   | 禁用日期规则。                               |
| `format`       | `string`                                             | 按 picker 推导 | 否   | 输入框展示和解析格式。                       |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6`                    | `0`            | 否   | 周起始日。                                   |
| `allowClear`   | `boolean`                                            | `true`         | 否   | 有值时显示清空按钮；清空按钮与 suffix 互斥。 |
| `disabled`     | `boolean`                                            | `false`        | 否   | 禁用输入。                                   |
| `readOnly`     | `boolean`                                            | `false`        | 否   | 输入只读。                                   |

## RangePicker Props

| 参数名         | 类型                                                            | 默认值  | 必填 | 说明                       |
| -------------- | --------------------------------------------------------------- | ------- | ---- | -------------------------- |
| `value`        | `CalendarRange<CalendarValue>`                                  | -       | 否   | 受控范围值。               |
| `defaultValue` | `CalendarRange<CalendarValue>`                                  | `{}`    | 否   | 非受控初始范围。           |
| `allowEmpty`   | `boolean \| { start?: boolean; end?: boolean }`                 | `false` | 否   | 是否允许范围端点为空。     |
| `order`        | `boolean`                                                       | `true`  | 否   | start/end 是否自动排序。   |
| `disabledDate` | `(date: CalendarDate, activePart: 'start' \| 'end') => boolean` | -       | 否   | 可根据当前选择端动态禁用。 |

## 事件

| 事件名         | 类型                      | 说明                                           |
| -------------- | ------------------------- | ---------------------------------------------- |
| `onChange`     | `(value) => void`         | 提交值变化。单选无确认时选择后立即触发并关闭。 |
| `onOpenChange` | `(open: boolean) => void` | Popover 打开关闭。                             |

## 受控与非受控

`value` 存在时组件受控，内部不会保存已提交值；`defaultValue` 只用于非受控初始值。`open` 也遵循同样规则。

## 自定义组合

`DatePickerPanel` 内部复用 Calendar，因此可以直接替换 `CalendarGrid` 和 `CalendarCell`。自定义 footer 可通过 render function 获取 `close`、`clear`、`confirm`、`cancel`，其中 `close` 只关闭面板，`confirm` 才提交 pending value。

## 注意事项

- `value` 不返回 input string。后端需要字符串时使用 `formatDatePickerValue`。
- 不要用 `Date` 隐式转换日期；需要时间点时由业务明确指定时区和时间。
- `suffix` 与 clear 按 Input 规则互斥：有值且 `allowClear=true` 时显示 clear，否则显示 suffix。
