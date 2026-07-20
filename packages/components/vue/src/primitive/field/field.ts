import {
  fieldContentClassName,
  fieldDescriptionClassName,
  fieldErrorClassName,
  fieldGroupClassName,
  fieldLabelClassName,
  fieldLegendClassName,
  fieldRequiredIndicatorClassName,
  fieldRootClassName,
  fieldSeparatorClassName,
  fieldSetClassName,
  fieldTitleClassName,
  type FieldGroupStyleProps,
  type FieldStyleProps,
} from '@fex/components-styles/field'
import { cn } from '@fex/utils'
import { computed, defineComponent, h, inject, provide, useAttrs, useId, type Component, type InjectionKey, type PropType } from 'vue'
import { useFormContext } from '../form/form-context'

export interface FieldState { disabled: boolean; invalid: boolean; readOnly: boolean; required: boolean }
export interface FieldControlBinding { props: Record<string, boolean | string | undefined>; state: FieldState }
interface FieldContextValue extends FieldState { controlId: string; descriptionId: string; errorId: string; hasDescription: boolean; hasError: boolean }
const fieldContextKey: InjectionKey<FieldContextValue> = Symbol('FexField')
const formFieldNameKey: InjectionKey<string> = Symbol('FexFormFieldName')
function useFieldContext(component: string) { const context = inject(fieldContextKey); if (!context) throw new Error(`${component} must be used inside FieldRoot.`); return context }
function attrsWithClass(attrs: Record<string, unknown>, defaultClassName: string) { return { ...attrs, class: cn(defaultClassName, attrs.class as string | undefined) } }

const FormFieldNameProvider = defineComponent({
  name: 'FormFieldNameProvider',
  props: { name: { type: String, required: true } },
  setup(props, { slots }) {
    provide(formFieldNameKey, props.name)
    return () => slots.default?.()
  },
})

/** The only public field-state entry point. Native TanStack Field props are forwarded unchanged. */
export const Field = defineComponent({
  name: 'Field',
  inheritAttrs: false,
  props: { name: { type: String, required: true } },
  setup(props, { attrs, slots }) {
    const form = useFormContext()
    return () => h(form.Field as Component, { ...attrs, name: props.name }, {
      ...slots,
      default: (slotProps: { field?: { name?: unknown } }) => h(FormFieldNameProvider, { name: String(slotProps.field?.name ?? props.name) }, () => slots.default?.(slotProps)),
    })
  },
})

export const FieldRoot = defineComponent({
  name: 'FieldRoot', inheritAttrs: false,
  props: { id: String, orientation: { type: String as PropType<NonNullable<FieldStyleProps['orientation']>>, default: 'vertical' }, disabled: Boolean, readOnly: Boolean, required: Boolean, invalid: Boolean, hasDescription: Boolean, hasError: Boolean },
  setup(props, { slots }) {
    const attrs = useAttrs(); const generatedId = useId(); const fieldName = inject(formFieldNameKey, undefined); const baseId = computed(() => props.id ?? fieldName ?? generatedId)
    const context = {
      get controlId() { return `${baseId.value}-control` }, get descriptionId() { return `${baseId.value}-description` }, get errorId() { return `${baseId.value}-error` },
      get disabled() { return props.disabled }, get invalid() { return props.invalid }, get readOnly() { return props.readOnly }, get required() { return props.required }, get hasDescription() { return props.hasDescription }, get hasError() { return props.hasError },
    }
    provide(fieldContextKey, context)
    // Root needs programmatic attribute forwarding while preserving scoped slots and one stable DOM node.
    return () => h('div', { ...attrs, 'data-slot': 'field-root', 'data-field-name': fieldName, 'data-orientation': props.orientation, 'data-disabled': props.disabled || undefined, 'data-readonly': props.readOnly || undefined, 'data-required': props.required || undefined, 'data-invalid': props.invalid || undefined, class: cn(fieldRootClassName({ orientation: props.orientation }), attrs.class as string | undefined) }, slots.default?.())
  },
})

export const FieldControl = defineComponent({ name: 'FieldControl', setup(_, { slots }) { const context = useFieldContext('FieldControl'); const fieldName = inject(formFieldNameKey, undefined); return () => { const describedBy = [context.hasDescription ? context.descriptionId : '', context.hasError ? context.errorId : ''].filter(Boolean).join(' ') || undefined; return slots.default?.({ props: { id: context.controlId, disabled: context.disabled || undefined, readonly: context.readOnly || undefined, 'aria-required': context.required || undefined, 'aria-invalid': context.invalid || undefined, 'aria-describedby': describedBy, 'aria-errormessage': context.invalid && context.hasError ? context.errorId : undefined, 'data-field-name': fieldName }, state: context }) } } })

// The remaining parts are deliberately single-node wrappers; render functions keep native attrs intact without duplicating SFC boilerplate.
export const FieldLabel = defineComponent({ name: 'FieldLabel', inheritAttrs: false, setup(_, { slots }) { const attrs = useAttrs(); const context = useFieldContext('FieldLabel'); return () => h('label', { ...attrsWithClass(attrs, fieldLabelClassName), for: attrs.for ?? context.controlId, 'data-slot': 'field-label' }, slots.default?.()) } })
export const FieldRequiredIndicator = defineComponent({ name: 'FieldRequiredIndicator', inheritAttrs: false, setup(_, { slots }) { const attrs = useAttrs(); return () => h('span', { ...attrsWithClass(attrs, fieldRequiredIndicatorClassName), 'aria-hidden': 'true', 'data-slot': 'field-required-indicator' }, slots.default?.() ?? '*') } })
export const FieldDescription = defineComponent({ name: 'FieldDescription', inheritAttrs: false, setup(_, { slots }) { const attrs = useAttrs(); const context = useFieldContext('FieldDescription'); return () => h('p', { ...attrsWithClass(attrs, fieldDescriptionClassName), id: attrs.id ?? context.descriptionId, 'data-slot': 'field-description' }, slots.default?.()) } })
export const FieldError = defineComponent({ name: 'FieldError', inheritAttrs: false, props: { errors: Array as PropType<readonly unknown[]> }, setup(props, { slots }) { const attrs = useAttrs(); const context = useFieldContext('FieldError'); return () => { const content = slots.default?.() ?? props.errors?.map((error) => h('div', null, String(error))); return content?.length ? h('div', { ...attrsWithClass(attrs, fieldErrorClassName), id: attrs.id ?? context.errorId, role: 'alert', 'aria-live': 'polite', 'data-slot': 'field-error' }, content) : null } } })
export const FieldGroup = defineComponent({ name: 'FieldGroup', inheritAttrs: false, props: { orientation: String as PropType<NonNullable<FieldGroupStyleProps['orientation']>> }, setup(props, { slots }) { const attrs = useAttrs(); return () => h('div', { ...attrsWithClass(attrs, fieldGroupClassName({ orientation: props.orientation })), role: attrs.role ?? 'group', 'data-slot': 'field-group', 'data-orientation': props.orientation }, slots.default?.()) } })
export const FieldSet = defineComponent({ name: 'FieldSet', inheritAttrs: false, setup(_, { slots }) { const attrs = useAttrs(); return () => h('fieldset', { ...attrsWithClass(attrs, fieldSetClassName), 'data-slot': 'field-set' }, slots.default?.()) } })
export const FieldLegend = defineComponent({ name: 'FieldLegend', inheritAttrs: false, setup(_, { slots }) { const attrs = useAttrs(); return () => h('legend', { ...attrsWithClass(attrs, fieldLegendClassName), 'data-slot': 'field-legend' }, slots.default?.()) } })
export const FieldContent = defineComponent({ name: 'FieldContent', inheritAttrs: false, setup(_, { slots }) { const attrs = useAttrs(); return () => h('div', { ...attrsWithClass(attrs, fieldContentClassName), 'data-slot': 'field-content' }, slots.default?.()) } })
export const FieldTitle = defineComponent({ name: 'FieldTitle', inheritAttrs: false, setup(_, { slots }) { const attrs = useAttrs(); return () => h('div', { ...attrsWithClass(attrs, fieldTitleClassName), 'data-slot': 'field-title' }, slots.default?.()) } })
export const FieldSeparator = defineComponent({ name: 'FieldSeparator', inheritAttrs: false, setup() { const attrs = useAttrs(); return () => h('div', { ...attrsWithClass(attrs, fieldSeparatorClassName), role: attrs.role ?? 'separator', 'data-slot': 'field-separator' }) } })
