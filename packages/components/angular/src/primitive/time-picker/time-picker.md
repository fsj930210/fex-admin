# TimePicker Primitive

TimePicker primitive 内置 Input Trigger、Popover Content、Panel 和四个可组合时间列。它负责时间输入、弹层交互、列内键盘与滚动；校验规则仍由表单或调用方负责，primitive 只接收并展示校验状态。

## 导入

请从当前框架包的 `primitive/time-picker` 子路径导入 `TimePickerRoot`、`TimePickerTrigger`、`TimePickerContent`、`TimePickerPanel`、四个专用 Column 和逻辑入口。

## 基本组合

```tsx
<TimePickerRoot defaultValue={{ hour: 8, minute: 30, second: 0 }}>
  <TimePickerTrigger />
  <TimePickerContent>
    <TimePickerPanel>
      <TimePickerHourColumn />
      <TimePickerMinuteColumn step={5} />
      <TimePickerSecondColumn step={10} />
    </TimePickerPanel>
  </TimePickerContent>
</TimePickerRoot>
```

12 小时制显式设置 `use12Hours` 并组合 PeriodColumn。内部 TimeValue 始终使用 24 小时值。

## Root Props

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| value | TimeValue \| null | - | 否 | 受控时间值 |
| defaultValue | TimeValue \| null | null | 否 | 非受控初始值 |
| onChange/change | callback | - | 否 | 选择列项时返回完整时间及原因 |
| use12Hours | boolean | false | 否 | 使用 12 小时列语义 |
| disabled | boolean | false | 否 | 禁用全部列 |
| readOnly | boolean | false | 否 | 允许查看但禁止修改 |
| disabledTime | DisabledTime | - | 否 | 根据当前时分秒禁用具体选项 |

## Column Props

Hour、Minute、Second 列支持 `step?: number`、`disabled?: boolean` 和 `isItemDisabled?: (value) => boolean`。PeriodColumn 支持 `labels`、`disabled` 和 `isItemDisabled`。

`disabled` 禁用整列，`isItemDisabled` 和 Root 的 `disabledTime` 禁用具体选项。键盘上下键只负责列内移动；左右切列属于后续 UI 组合层。

## 受控与非受控

传入 value 时，父级必须在 change 回调中更新 value；只传 defaultValue 时由 primitive 保存值。空值首次选择以第一组值 `00:00:00` 补齐，不提供初始化策略属性。高级初始化可以通过公开逻辑入口自行组合。

## 滚动

初次挂载和普通外部更新即时对齐；点击或键盘选择使用平滑滚动。滚动位置不会反向修改时间值，并遵循 reduced-motion。

## 注意事项

- Trigger 和 Content 是 primitive 内置基础部件；`format` 决定输入解析与显示，组合层根据 `analyzeTimeFormat` 的结果选择需要渲染的专用列。
- Content 复用 Popover，自动与 Trigger 等宽、碰撞翻转、互斥打开并在点击外部时关闭；Column 复用 Scrollbar。
- 前后缀、面板附加内容和范围选择仍由调用方组合。
- 通用 format/parse 位于 `@fex/components-core/date/utils`。
- invalid 是 Input/Form 的外部展示状态，不属于 TimePicker primitive 的业务校验。
