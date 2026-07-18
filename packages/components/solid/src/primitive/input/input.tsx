import { inputAddonAfterClassName, inputAddonBeforeClassName, inputClearClassName, inputControlClassName, inputPrefixClassName, inputRootClassName, inputSuffixClassName } from '@fex/components-styles/input'
import { cn } from '@fex/utils'
import { createContext, splitProps, type JSX, type ParentProps, useContext } from 'solid-js'
import { CloseIcon } from '../../icon/close'
import { Button } from '../button/button'
import { createInput, type InputChangeReason } from './create-input'

type InputContextValue = ReturnType<typeof createInput>
const InputContext = createContext<InputContextValue>()

export interface InputRootProps extends ParentProps<JSX.HTMLAttributes<HTMLDivElement>> { value?: string | undefined; defaultValue?: string | undefined; disabled?: boolean | undefined; readOnly?: boolean | undefined; invalid?: boolean | undefined; onValueChange?: ((value: string, meta: { reason: InputChangeReason; event?: InputEvent }) => void) | undefined; onClear?: (() => void) | undefined }
export function InputRoot(props: InputRootProps) {
  const [local, rest] = splitProps(props, ['children', 'class', 'value', 'defaultValue', 'disabled', 'readOnly', 'invalid', 'onValueChange', 'onClear'])
  const input = createInput({ value: () => props.value, defaultValue: props.defaultValue, disabled: () => props.disabled, readOnly: () => props.readOnly, invalid: () => props.invalid, onValueChange: (value, meta) => props.onValueChange?.(value, meta), onClear: () => props.onClear?.() })
  return <InputContext.Provider value={input}><div {...rest} data-slot="input-root" data-disabled={input.disabled() || undefined} data-readonly={input.readOnly() || undefined} data-invalid={input.invalid() || undefined} class={cn(inputRootClassName, local.class)}>{local.children}</div></InputContext.Provider>
}

function useInputContext(name: string) { const context = useContext(InputContext); if (!context) throw new Error(`${name} must be used inside InputRoot.`); return context }
export function InputControl(props: JSX.InputHTMLAttributes<HTMLInputElement>) {
  const context = useInputContext('InputControl')
  const [local, rest] = splitProps(props, ['class', 'onInput', 'ref', 'disabled', 'readOnly', 'aria-invalid'])
  return <input {...rest} ref={(node) => { context.setFocusElement(node); if (typeof local.ref === 'function') local.ref(node) }} value={context.value()} disabled={context.disabled() || local.disabled} readOnly={context.readOnly() || local.readOnly} aria-invalid={local['aria-invalid'] ?? (context.invalid() || undefined)} data-slot="input-control" class={cn(inputControlClassName, local.class)} onInput={(event) => { if (typeof local.onInput === 'function') local.onInput(event); if (!event.defaultPrevented) context.setValue(event.currentTarget.value, 'input', event) }} />
}
function part(slot: string, className: string) { return (props: ParentProps<JSX.HTMLAttributes<HTMLSpanElement>>) => <span {...props} data-slot={slot} class={cn(className, props.class)}>{props.children}</span> }
export const InputPrefix = part('input-prefix', inputPrefixClassName)
export const InputSuffix = part('input-suffix', inputSuffixClassName)
export const InputAddonBefore = part('input-addon-before', inputAddonBeforeClassName)
export const InputAddonAfter = part('input-addon-after', inputAddonAfterClassName)
export function InputClear(props: ParentProps<JSX.ButtonHTMLAttributes<HTMLButtonElement>> & { forceMount?: boolean }) {
  const context = useInputContext('InputClear')
  const [local, rest] = splitProps(props, ['forceMount', 'class', 'children', 'onPointerDown', 'onClick'])
  return (local.forceMount || context.canClear()) ? <Button {...rest} type="button" data-slot="input-clear" disabled={!context.canClear()} class={cn(inputClearClassName, local.class)} onPointerDown={(event) => { if (typeof local.onPointerDown === 'function') local.onPointerDown(event); if (!event.defaultPrevented) event.preventDefault() }} onClick={(event) => { if (typeof local.onClick === 'function') local.onClick(event); if (!event.defaultPrevented) context.clear() }}>{local.children ?? <CloseIcon />}</Button> : null
}
