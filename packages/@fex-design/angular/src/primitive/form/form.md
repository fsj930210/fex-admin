# Angular Form and Field primitives

## 用途

`[fexForm]` 将原生 form 的提交交给 TanStack Form，并支持提交失败后定位首个错误控件。`[fexField]` 是 Angular 的字段适配指令，创建并维护 TanStack `FieldApi`。

## 原生 TanStack 参数

`[fexField]` 不再提供 `rules`、`dependencies`、`validateTrigger`、`validateDebounce` 或 `initialValue` 等二次 API。

使用 TanStack 的原生字段参数：

```html
<ng-container
  [fexField]="form"
  name="confirmPassword"
  [validators]="{
    onChange: confirmPasswordValidator,
    onChangeListenTo: ['password'],
    onChangeAsync: checkPasswordAsync,
    onChangeAsyncDebounceMs: 400
  }"
  #field="field"
>
  <!-- render field.api -->
</ng-container>
```

- 表单初始值使用 `injectForm({ defaultValues })`。
- 字段级初始值使用 `[defaultValue]`。
- 校验时机使用 `validators.onChange`、`onBlur`、`onSubmit` 等。
- 校验依赖使用 `validators.onChangeListenTo`、`onBlurListenTo`。
- 字段事件使用 `[listeners]`。

`FieldRoot`、`FieldLabel`、`FieldControl` 等只提供字段 DOM 和 ARIA 结构。布局策略、表单项封装和业务标签策略属于后续 ui 层。
