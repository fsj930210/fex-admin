<script lang="ts">
  import { fieldRootClassName, type FieldStyleProps } from '@fex/components-styles/field'
  import { cn } from '@fex/utils'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { Snippet } from 'svelte'
  import { setFieldContext } from './context'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> { id?: string; orientation?: FieldStyleProps['orientation']; disabled?: boolean; readOnly?: boolean; required?: boolean; invalid?: boolean; hasDescription?: boolean; hasError?: boolean; children?: Snippet }
  const generatedId = $props.id()
  let { id = generatedId, orientation = 'vertical', disabled = false, readOnly = false, required = false, invalid = false, hasDescription = false, hasError = false, class: className, children, ...rest }: Props = $props()
  setFieldContext({ controlId: () => `${id}-control`, descriptionId: () => `${id}-description`, errorId: () => `${id}-error`, disabled: () => disabled, invalid: () => invalid, readOnly: () => readOnly, required: () => required, hasDescription: () => hasDescription, hasError: () => hasError })
</script>

<div {...rest} data-slot="field-root" data-orientation={orientation} data-disabled={disabled || undefined} data-readonly={readOnly || undefined} data-required={required || undefined} data-invalid={invalid || undefined} class={cn(fieldRootClassName({ orientation }), className)}>{@render children?.()}</div>
