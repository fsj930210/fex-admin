# Calendar Primitive

Calendar primitive 提供基于 `Temporal.PlainDate` / `Temporal.PlainYearMonth` 的日期网格和单元格交互骨架。它只处理基础日期能力，不内置农历、价格、日程、课表等业务展示。

## 导入

```tsx
import {
  CalendarCell,
  CalendarGrid,
  CalendarHeader,
  CalendarNavigationButton,
  CalendarRoot,
  CalendarWeekHeader,
} from '@fex/components-react/primitive/calendar'
```

日期工具函数从框架包入口导入，业务侧不需要直接依赖 core：

```ts
import { addDate, isBeforeDate, setMonth, startOfDate } from '@fex/components-react/hooks/use-date-utils'

import { useDateUtils } from '@fex/components-react/hooks/use-date-utils'
```

## 基础示例

```tsx
import { createCalendarDate } from '@fex/components-core/calendar'
import {
  CalendarCell,
  CalendarGrid,
  CalendarRoot,
  CalendarWeekHeader,
} from '@fex/components-react/primitive/calendar'

export function Demo() {
  return (
    <CalendarRoot defaultViewDate={createCalendarDate(2026, 7, 1)}>
      <CalendarWeekHeader />
      <CalendarGrid>{(cell) => <CalendarCell key={cell.key} cell={cell} />}</CalendarGrid>
    </CalendarRoot>
  )
}
```

## Props

| 参数名             | 类型                               | 默认值               | 必填 | 说明                                                        |
| ------------------ | ---------------------------------- | -------------------- | ---- | ----------------------------------------------------------- |
| `value`            | `CalendarValue \| null`            | `undefined`          | 否   | 受控选中值。                                                |
| `defaultValue`     | `CalendarValue \| null`            | `null`               | 否   | 非受控默认选中值。                                          |
| `viewDate`         | `CalendarDate`                     | `undefined`          | 否   | 受控面板日期。                                              |
| `defaultViewDate`  | `CalendarDate`                     | `getCalendarToday()` | 否   | 非受控默认面板日期。                                        |
| `panel`            | `CalendarPanel`                    | `undefined`          | 否   | 受控面板类型。                                              |
| `defaultPanel`     | `CalendarPanel`                    | `'date'`             | 否   | 非受控默认面板类型。                                        |
| `granularity`      | `CalendarGranularity`              | `'date'`             | 否   | 选择粒度，支持 `date`、`week`、`month`、`quarter`、`year`。 |
| `weekStartsOn`     | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6`  | `0`                  | 否   | 周起始日，`0` 表示周日。                                    |
| `today`            | `CalendarDate`                     | `getCalendarToday()` | 否   | 当前日期，用于 today 状态；测试或 demo 可显式固定。         |
| `min`              | `CalendarDate`                     | `undefined`          | 否   | 最小可选日期。                                              |
| `max`              | `CalendarDate`                     | `undefined`          | 否   | 最大可选日期。                                              |
| `disabledDate`     | `(date: CalendarDate) => boolean`  | `undefined`          | 否   | 禁用日期判断。                                              |
| `onValueChange`    | `(value: CalendarValue) => void`   | `undefined`          | 否   | 用户选择单元格后触发。                                      |
| `onViewDateChange` | `(viewDate: CalendarDate) => void` | `undefined`          | 否   | 面板日期变化后触发。                                        |
| `onPanelChange`    | `(panel: CalendarPanel) => void`   | `undefined`          | 否   | 面板类型变化后触发。                                        |

## 导航按钮

`CalendarNavigationButton` 内置常用面板导航动作，调用方只负责摆放和样式：

```tsx
<CalendarNavigationButton action="previous-year" aria-label="上一年">
  «
</CalendarNavigationButton>
<CalendarNavigationButton action="previous-month" aria-label="上一月">
  ‹
</CalendarNavigationButton>
<CalendarNavigationButton action="next-month" aria-label="下一月">
  ›
</CalendarNavigationButton>
<CalendarNavigationButton action="next-year" aria-label="下一年">
  »
</CalendarNavigationButton>
```

支持的 action 包括 `previous-year`、`previous-month`、`next-month`、`next-year`、`previous-panel`、`next-panel`。

## 事件说明

`CalendarCell` 点击时会调用 `CalendarRoot` 的内部选择逻辑，并在非禁用状态下触发 `onValueChange`。普通业务流转应放在这个事件回调中处理。

## 日期工具

Calendar core 暴露一组基于 Temporal 的常用工具，供 DatePicker、RangePicker、快捷禁用规则和自定义业务单元格复用：

| 方法                                                                                  | 说明                                 |
| ------------------------------------------------------------------------------------- | ------------------------------------ |
| `setDate` / `setYear` / `setMonth` / `setDay`          | 设置某一天、某一月、某一年。         |
| `addDate` / `subtractDate`                                             | 增减天、周、月、年。                 |
| `startOfDate` / `endOfDate`                                            | 获取 day/week/month/quarter/year 边界。 |
| `isBeforeDate` / `isAfterDate`                                         | 判断日期先后。                       |
| `isSameOrBeforeDate` / `isSameOrAfterDate` / `isBetweenDate`   | 判断闭区间或开区间关系。             |
| `minDate` / `maxDate` / `clampDate`                            | 日期取最小、最大或限制到区间内。     |
| `getQuarter` / `setQuarter` / `getYear`                        | 日期和季度、年份值互转。             |
| `getWeekStart` / `getWeekEnd`                                          | 按 `weekStartsOn` 计算周起止日期。    |

## 受控与非受控

`value` / `defaultValue` 控制选中值，`viewDate` / `defaultViewDate` 控制面板位置，`panel` / `defaultPanel` 控制面板类型。三类状态彼此独立，DatePicker 或 RangePicker 可以只接管其中一部分。

## 注意事项

- Calendar primitive 不使用旧 `Date` API。
- 高级展示通过 `CalendarGrid` 的 render prop 或自定义 `CalendarCell` 内容扩展。
- RangePicker 应由上层组合两个 Calendar，并使用 core 的 range 工具计算区间状态。
