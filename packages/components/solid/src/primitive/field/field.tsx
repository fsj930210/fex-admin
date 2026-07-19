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
  type FieldStyleProps,
} from '@fex/components-styles/field'
import { cn } from '@fex/utils'
import { createContext, createUniqueId, For, Show, splitProps, useContext, type JSX, type ParentProps } from 'solid-js'

export interface FieldState { disabled: boolean; invalid: boolean; readOnly: boolean; required: boolean }
export interface FieldControlBinding { props: { id: string; required?: true | undefined; disabled?: true | undefined; readOnly?: true | undefined; 'aria-required'?: true | undefined; 'aria-invalid'?: true | undefined; 'aria-describedby'?: string | undefined; 'aria-errormessage'?: string | undefined }; state: FieldState }
interface FieldContextValue extends FieldState { controlId: string; descriptionId: string; errorId: string; hasDescription: boolean; hasError: boolean }
const FieldContext = createContext<FieldContextValue>()
function useFieldContext(component: string) { const context = useContext(FieldContext); if (!context) throw new Error(`${component} must be used inside FieldRoot.`); return context }

export interface FieldRootProps extends ParentProps<Omit<JSX.HTMLAttributes<HTMLDivElement>, 'id'>>, FieldStyleProps { id?: string; disabled?: boolean; readOnly?: boolean; required?: boolean; invalid?: boolean; hasDescription?: boolean; hasError?: boolean }
export function FieldRoot(props: FieldRootProps) {
  const generatedId = createUniqueId()
  const [local, rest] = splitProps(props, ['id', 'orientation', 'disabled', 'readOnly', 'required', 'invalid', 'hasDescription', 'hasError', 'class', 'children'])
  const baseId = () => local.id ?? generatedId
  const context: FieldContextValue = {
    get controlId() { return `${baseId()}-control` }, get descriptionId() { return `${baseId()}-description` }, get errorId() { return `${baseId()}-error` },
    get disabled() { return local.disabled ?? false }, get invalid() { return local.invalid ?? false }, get readOnly() { return local.readOnly ?? false }, get required() { return local.required ?? false },
    get hasDescription() { return local.hasDescription ?? false }, get hasError() { return local.hasError ?? false },
  }
  return <FieldContext.Provider value={context}><div {...rest} data-slot="field-root" data-orientation={local.orientation ?? 'vertical'} data-disabled={context.disabled || undefined} data-readonly={context.readOnly || undefined} data-required={context.required || undefined} data-invalid={context.invalid || undefined} class={cn(fieldRootClassName({ orientation: local.orientation ?? 'vertical' }), local.class)}>{local.children}</div></FieldContext.Provider>
}

export function FieldControl(props: { children: (binding: FieldControlBinding) => JSX.Element }) {
  const context = useFieldContext('FieldControl')
  const describedBy = () => [context.hasDescription ? context.descriptionId : '', context.hasError ? context.errorId : ''].filter(Boolean).join(' ') || undefined
  return props.children({ props: { id: context.controlId, required: context.required || undefined, disabled: context.disabled || undefined, readOnly: context.readOnly || undefined, 'aria-required': context.required || undefined, 'aria-invalid': context.invalid || undefined, 'aria-describedby': describedBy(), 'aria-errormessage': context.invalid && context.hasError ? context.errorId : undefined }, state: context })
}

export function FieldLabel(props: JSX.LabelHTMLAttributes<HTMLLabelElement>) { const context = useFieldContext('FieldLabel'); const [local, rest] = splitProps(props, ['for', 'class']); return <label {...rest} for={local.for ?? context.controlId} data-slot="field-label" class={cn(fieldLabelClassName, local.class)} /> }
export function FieldRequiredIndicator(props: ParentProps<JSX.HTMLAttributes<HTMLSpanElement>>) { const [local, rest] = splitProps(props, ['class', 'children']); return <span {...rest} aria-hidden="true" data-slot="field-required-indicator" class={cn(fieldRequiredIndicatorClassName, local.class)}>{local.children ?? '*'}</span> }
export function FieldDescription(props: JSX.HTMLAttributes<HTMLParagraphElement>) { const context = useFieldContext('FieldDescription'); const [local, rest] = splitProps(props, ['id', 'class']); return <p {...rest} id={local.id ?? context.descriptionId} data-slot="field-description" class={cn(fieldDescriptionClassName, local.class)} /> }
export function FieldError(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement> & { errors?: readonly JSX.Element[] }>) { const context = useFieldContext('FieldError'); const [local, rest] = splitProps(props, ['id', 'class', 'children', 'errors']); return <Show when={local.children ?? local.errors?.length}><div {...rest} id={local.id ?? context.errorId} role="alert" aria-live="polite" data-slot="field-error" class={cn(fieldErrorClassName, local.class)}>{local.children ?? <For each={local.errors}>{(error) => <div>{error}</div>}</For>}</div></Show> }
export function FieldGroup(props: JSX.HTMLAttributes<HTMLDivElement>) { const [local, rest] = splitProps(props, ['class']); return <div {...rest} role={props.role ?? 'group'} data-slot="field-group" class={cn(fieldGroupClassName, local.class)} /> }
export function FieldSet(props: JSX.FieldsetHTMLAttributes<HTMLFieldSetElement>) { const [local, rest] = splitProps(props, ['class']); return <fieldset {...rest} data-slot="field-set" class={cn(fieldSetClassName, local.class)} /> }
export function FieldLegend(props: JSX.HTMLAttributes<HTMLLegendElement>) { const [local, rest] = splitProps(props, ['class']); return <legend {...rest} data-slot="field-legend" class={cn(fieldLegendClassName, local.class)} /> }
export function FieldContent(props: JSX.HTMLAttributes<HTMLDivElement>) { const [local, rest] = splitProps(props, ['class']); return <div {...rest} data-slot="field-content" class={cn(fieldContentClassName, local.class)} /> }
export function FieldTitle(props: JSX.HTMLAttributes<HTMLDivElement>) { const [local, rest] = splitProps(props, ['class']); return <div {...rest} data-slot="field-title" class={cn(fieldTitleClassName, local.class)} /> }
export function FieldSeparator(props: JSX.HTMLAttributes<HTMLDivElement>) { const [local, rest] = splitProps(props, ['class']); return <div {...rest} role={props.role ?? 'separator'} data-slot="field-separator" class={cn(fieldSeparatorClassName, local.class)} /> }
