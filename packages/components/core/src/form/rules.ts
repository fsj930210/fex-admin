import type {
  DeepKeys,
  DeepValue,
  FieldAsyncValidateOrFn,
  FieldValidateOrFn,
  FormAsyncValidateOrFn,
  FormValidateOrFn,
} from '@tanstack/form-core'

export type ValidateTrigger = 'change' | 'blur' | 'submit'

export interface RuleFormApi<TValues> {
  getFieldValue<TName extends DeepKeys<TValues>>(name: TName): DeepValue<TValues, TName>
  state: { values: TValues }
}

export interface RuleConfig<TValue = unknown> {
  enum?: readonly TValue[]
  len?: number
  max?: number
  message?: string
  min?: number
  pattern?: RegExp
  required?: boolean
  transform?: (value: TValue) => unknown
  type?: 'array' | 'boolean' | 'email' | 'number' | 'string' | 'url'
  validateTrigger?: ValidateTrigger | readonly ValidateTrigger[]
  validator?: (rule: RuleConfig<TValue>, value: TValue) => unknown | Promise<unknown>
  whitespace?: boolean
}

export type FieldRule<TValues, TValue> =
  | RuleConfig<TValue>
  | ((form: RuleFormApi<TValues>) => RuleConfig<TValue>)

export interface FieldRuleOptions<TValues, TValue> {
  dependencies?: readonly DeepKeys<TValues>[]
  initialValue?: NoInfer<TValue>
  rules?: readonly FieldRule<TValues, TValue>[]
  validateDebounce?: number
  validateFirst?: boolean
  validateTrigger?: ValidateTrigger | readonly ValidateTrigger[]
}

export interface CompilableFieldProps<TValues, TValue> extends FieldRuleOptions<TValues, TValue> {
  defaultValue?: TValue
  validators?: Record<string, unknown>
}

function asTriggers(value: ValidateTrigger | readonly ValidateTrigger[] | undefined) {
  return value === undefined ? ['change'] : Array.isArray(value) ? value : [value]
}

function isEmpty(value: unknown) {
  return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)
}

function sizeOf(value: unknown) {
  if (typeof value === 'number') return value
  if (typeof value === 'string' || Array.isArray(value)) return value.length
  return undefined
}

function defaultMessage(rule: RuleConfig, value: unknown) {
  if (rule.required && isEmpty(value)) return '此项为必填项'
  if (rule.whitespace && typeof value === 'string' && value.trim().length === 0) return '不能仅包含空格'
  if (rule.type === 'email' && typeof value === 'string' && !/^\S+@\S+\.\S+$/.test(value)) return '请输入有效的邮箱地址'
  if (rule.type === 'url' && typeof value === 'string') {
    try { new URL(value) } catch { return '请输入有效的网址' }
  }
  if (rule.type === 'number' && typeof value !== 'number') return '请输入数字'
  if (rule.type === 'boolean' && typeof value !== 'boolean') return '请输入布尔值'
  if (rule.type === 'array' && !Array.isArray(value)) return '请输入数组'
  if (rule.type === 'string' && typeof value !== 'string') return '请输入文本'
  if (rule.enum && !rule.enum.includes(value)) return '请选择有效值'
  const size = sizeOf(value)
  if (rule.len !== undefined && size !== rule.len) return `长度必须为 ${rule.len}`
  if (rule.min !== undefined && size !== undefined && size < rule.min) return `不能小于 ${rule.min}`
  if (rule.max !== undefined && size !== undefined && size > rule.max) return `不能大于 ${rule.max}`
  if (rule.pattern && typeof value === 'string') {
    rule.pattern.lastIndex = 0
    if (!rule.pattern.test(value)) return '格式不正确'
  }
  return undefined
}

async function runRules<TValues, TValue>(
  rules: readonly FieldRule<TValues, TValue>[],
  form: RuleFormApi<TValues>,
  value: TValue,
  trigger: ValidateTrigger,
  defaultTriggers: readonly ValidateTrigger[],
  validateFirst: boolean,
) {
  const errors: string[] = []

  for (const item of rules) {
    const rule = typeof item === 'function' ? item(form) : item
    if (!asTriggers(rule.validateTrigger ?? defaultTriggers).includes(trigger)) continue
    const transformed = rule.transform ? rule.transform(value) : value
    if (isEmpty(transformed) && !rule.required && !rule.validator) continue
    const builtInError = defaultMessage(rule as RuleConfig, transformed)

    if (builtInError) errors.push(rule.message ?? builtInError)
    else if (rule.validator) {
      try {
        const result = await rule.validator(rule, transformed as TValue)
        if (typeof result === 'string') errors.push(result)
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error))
      }
    }

    if (validateFirst && errors.length > 0) break
  }

  if (errors.length === 0) return undefined
  if (validateFirst || errors.length === 1) return errors[0]
  return errors
}

export function compileFieldRuleProps<TValues, TValue>(
  props: CompilableFieldProps<TValues, TValue>,
  form: RuleFormApi<TValues>,
) {
  const {
    dependencies,
    initialValue,
    rules,
    validateDebounce = 0,
    validateFirst = false,
    validateTrigger,
    validators,
    ...fieldProps
  } = props

  const valueProps = fieldProps.defaultValue === undefined && initialValue !== undefined
    ? { ...fieldProps, defaultValue: initialValue }
    : fieldProps

  if (!rules) return { ...valueProps, validators }

  const defaultTriggers = asTriggers(validateTrigger)
  const triggers = Array.from(new Set([
    ...defaultTriggers,
    ...rules.flatMap((rule) => typeof rule === 'function' ? [] : asTriggers(rule.validateTrigger ?? defaultTriggers)),
  ]))
  const compiled: Record<string, unknown> = {}
  const validate = (trigger: ValidateTrigger) => ({ value }: { value: TValue }) => runRules(rules, form, value, trigger, defaultTriggers, validateFirst)

  if (triggers.includes('change')) {
    compiled.onChangeAsync = validate('change')
    compiled.onChangeAsyncDebounceMs = validateDebounce
    compiled.onChangeListenTo = dependencies
  }
  if (triggers.includes('blur')) {
    compiled.onBlurAsync = validate('blur')
    compiled.onBlurAsyncDebounceMs = validateDebounce
    compiled.onBlurListenTo = dependencies
  }
  if (triggers.includes('submit')) compiled.onSubmitAsync = validate('submit')

  return { ...valueProps, validators: { ...validators, ...compiled } }
}

declare module '@tanstack/form-core' {
  interface FieldOptions<
    TParentData,
    TName extends DeepKeys<TParentData>,
    TData extends DeepValue<TParentData, TName>,
    TOnMount extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
    TOnChange extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
    TOnChangeAsync extends undefined | FieldAsyncValidateOrFn<TParentData, TName, TData>,
    TOnBlur extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
    TOnBlurAsync extends undefined | FieldAsyncValidateOrFn<TParentData, TName, TData>,
    TOnSubmit extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
    TOnSubmitAsync extends undefined | FieldAsyncValidateOrFn<TParentData, TName, TData>,
    TOnDynamic extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
    TOnDynamicAsync extends undefined | FieldAsyncValidateOrFn<TParentData, TName, TData>,
  > {
    dependencies?: readonly DeepKeys<TParentData>[]
    initialValue?: NoInfer<TData>
    rules?: readonly FieldRule<TParentData, TData>[]
    validateDebounce?: number
    validateFirst?: boolean
    validateTrigger?: ValidateTrigger | readonly ValidateTrigger[]
  }

  interface FieldApiOptions<
    TParentData,
    TName extends DeepKeys<TParentData>,
    TData extends DeepValue<TParentData, TName>,
    TOnMount extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
    TOnChange extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
    TOnChangeAsync extends undefined | FieldAsyncValidateOrFn<TParentData, TName, TData>,
    TOnBlur extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
    TOnBlurAsync extends undefined | FieldAsyncValidateOrFn<TParentData, TName, TData>,
    TOnSubmit extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
    TOnSubmitAsync extends undefined | FieldAsyncValidateOrFn<TParentData, TName, TData>,
    TOnDynamic extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
    TOnDynamicAsync extends undefined | FieldAsyncValidateOrFn<TParentData, TName, TData>,
    TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
    TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
    TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
    TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
    TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
    TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
    TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
    TFormOnDynamic extends undefined | FormValidateOrFn<TParentData>,
    TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
    TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
    TParentSubmitMeta,
  > {
    dependencies?: readonly DeepKeys<TParentData>[]
    initialValue?: NoInfer<TData>
    rules?: readonly FieldRule<TParentData, TData>[]
    validateDebounce?: number
    validateFirst?: boolean
    validateTrigger?: ValidateTrigger | readonly ValidateTrigger[]
  }
}
