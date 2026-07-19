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
import {
  createContext,
  type ComponentProps,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  use,
  useId,
} from 'react'

export interface FieldState {
  disabled: boolean
  invalid: boolean
  readOnly: boolean
  required: boolean
}

export interface FieldControlBinding {
  props: {
    id: string
    required?: true | undefined
    disabled?: true | undefined
    readOnly?: true | undefined
    'aria-invalid'?: true | undefined
    'aria-required'?: true | undefined
    'aria-describedby'?: string | undefined
    'aria-errormessage'?: string | undefined
  }
  state: FieldState
}

interface FieldContextValue extends FieldState {
  controlId: string
  descriptionId: string
  errorId: string
  hasDescription: boolean
  hasError: boolean
}

const FieldContext = createContext<FieldContextValue | null>(null)

function useFieldContext(component: string) {
  const context = use(FieldContext)
  if (!context) throw new Error(`${component} must be used inside FieldRoot.`)
  return context
}

export interface FieldRootProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'id'>, FieldStyleProps {
  id?: string | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
  required?: boolean | undefined
  invalid?: boolean | undefined
  hasDescription?: boolean | undefined
  hasError?: boolean | undefined
  ref?: Ref<HTMLDivElement> | undefined
}

export function FieldRoot({
  id,
  orientation = 'vertical',
  disabled = false,
  readOnly = false,
  required = false,
  invalid = false,
  hasDescription = false,
  hasError = false,
  className,
  ref,
  children,
  ...props
}: FieldRootProps) {
  const generatedId = useId()
  const baseId = id ?? generatedId
  const context: FieldContextValue = {
    controlId: `${baseId}-control`,
    descriptionId: `${baseId}-description`,
    errorId: `${baseId}-error`,
    disabled,
    invalid,
    readOnly,
    required,
    hasDescription,
    hasError,
  }

  return (
    <FieldContext value={context}>
      <div
        {...props}
        ref={ref}
        data-slot="field-root"
        data-orientation={orientation}
        data-disabled={disabled ? 'true' : undefined}
        data-readonly={readOnly ? 'true' : undefined}
        data-required={required ? 'true' : undefined}
        data-invalid={invalid ? 'true' : undefined}
        className={cn(fieldRootClassName({ orientation }), className)}
      >
        {children}
      </div>
    </FieldContext>
  )
}

export function FieldControl({ children }: { children: (binding: FieldControlBinding) => ReactNode }) {
  const context = useFieldContext('FieldControl')
  const describedBy = [context.hasDescription ? context.descriptionId : null, context.hasError ? context.errorId : null]
    .filter(Boolean)
    .join(' ') || undefined
  return children({
    props: {
      id: context.controlId,
      required: context.required || undefined,
      disabled: context.disabled || undefined,
      readOnly: context.readOnly || undefined,
      'aria-required': context.required || undefined,
      'aria-invalid': context.invalid || undefined,
      'aria-describedby': describedBy,
      'aria-errormessage': context.invalid && context.hasError ? context.errorId : undefined,
    },
    state: context,
  })
}

export function FieldLabel({ className, ...props }: ComponentProps<'label'>) {
  const context = useFieldContext('FieldLabel')
  return <label {...props} htmlFor={props.htmlFor ?? context.controlId} data-slot="field-label" className={cn(fieldLabelClassName, className)} />
}

export function FieldRequiredIndicator({ className, children = '*', ...props }: ComponentProps<'span'>) {
  return <span {...props} aria-hidden="true" data-slot="field-required-indicator" className={cn(fieldRequiredIndicatorClassName, className)}>{children}</span>
}

export function FieldDescription({ className, ...props }: ComponentProps<'p'>) {
  const context = useFieldContext('FieldDescription')
  return <p {...props} id={props.id ?? context.descriptionId} data-slot="field-description" className={cn(fieldDescriptionClassName, className)} />
}

export interface FieldErrorProps extends ComponentProps<'div'> { errors?: readonly ReactNode[] | undefined }
export function FieldError({ errors, className, children, ...props }: FieldErrorProps) {
  const context = useFieldContext('FieldError')
  const content = children ?? errors?.map((error, index) => <div key={typeof error === 'string' ? error : index}>{error}</div>)
  if (!content) return null
  return <div {...props} id={props.id ?? context.errorId} role="alert" aria-live="polite" data-slot="field-error" className={cn(fieldErrorClassName, className)}>{content}</div>
}

export function FieldGroup({ className, ...props }: ComponentProps<'div'>) { return <div {...props} role={props.role ?? 'group'} data-slot="field-group" className={cn(fieldGroupClassName, className)} /> }
export function FieldSet({ className, ...props }: ComponentProps<'fieldset'>) { return <fieldset {...props} data-slot="field-set" className={cn(fieldSetClassName, className)} /> }
export function FieldLegend({ className, ...props }: ComponentProps<'legend'>) { return <legend {...props} data-slot="field-legend" className={cn(fieldLegendClassName, className)} /> }
export function FieldContent({ className, ...props }: ComponentProps<'div'>) { return <div {...props} data-slot="field-content" className={cn(fieldContentClassName, className)} /> }
export function FieldTitle({ className, ...props }: ComponentProps<'div'>) { return <div {...props} data-slot="field-title" className={cn(fieldTitleClassName, className)} /> }
export function FieldSeparator({ className, ...props }: ComponentProps<'div'>) { return <div {...props} role={props.role ?? 'separator'} data-slot="field-separator" className={cn(fieldSeparatorClassName, className)} /> }
