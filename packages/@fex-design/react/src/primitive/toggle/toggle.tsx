import { createToggleGroupController } from '@fex-design/core/toggle/create-toggle-group-controller'
import { createToggleController } from '@fex-design/core/toggle/create-toggle-controller'
import { getToggleGroupFocusIndex, type ToggleGroupChangeMeta, type ToggleGroupValue } from '@fex-design/core/toggle/types'
import { toggleClassName, toggleGroupClassName, type ToggleStyleProps } from '@fex-design/styles/toggle'
import { cn } from '@fex/utils'
import { createContext, use, useRef, type ButtonHTMLAttributes, type CSSProperties, type HTMLAttributes, type Ref } from 'react'
import { useCoreStore } from '../../hooks/use-core-store'
import { useLazyRef } from '../../hooks/use-lazy-ref'
import { Button } from '../button/button'

interface ToggleGroupContextValue {
  disabled: boolean
  variant: ToggleStyleProps['variant']
  size: ToggleStyleProps['size']
  isPressed: (value: string) => boolean
  toggle: (value: string) => void
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null)

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'>, ToggleStyleProps {
  pressed?: boolean
  defaultPressed?: boolean
  value?: string
  ref?: Ref<HTMLButtonElement>
  onChange?: (pressed: boolean) => void
}

export function Toggle({ pressed, defaultPressed, value, disabled = false, variant, size, className, ref, onClick, onChange, ...props }: ToggleProps) {
  const group = use(ToggleGroupContext)
  const optionsRef = useRef({ pressed, defaultPressed, disabled, onChange })
  Object.assign(optionsRef.current, { pressed, defaultPressed, disabled, onChange })
  const controllerRef = useLazyRef(() => createToggleController({
    get pressed() { return optionsRef.current.pressed },
    get defaultPressed() { return optionsRef.current.defaultPressed },
    get disabled() { return optionsRef.current.disabled },
    onChange(next) { optionsRef.current.onChange?.(next) },
  }))
  const snapshot = useCoreStore(controllerRef.current)
  const inGroup = group !== null && value !== undefined
  const currentPressed = inGroup ? group.isPressed(value) : snapshot.pressed
  const currentDisabled = disabled || (group?.disabled ?? false)

  return <Button {...props} ref={ref} disabled={currentDisabled} aria-pressed={currentPressed} data-slot="toggle" data-state={currentPressed ? 'on' : 'off'} data-value={value} className={cn(toggleClassName({ variant: variant ?? group?.variant, size: size ?? group?.size }), className)} onClick={(event) => {
    onClick?.(event)
    if (event.defaultPrevented || currentDisabled) return
    if (inGroup) group.toggle(value)
    else controllerRef.current.toggle()
  }} />
}

interface ToggleGroupCommonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'>, ToggleStyleProps {
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical'
  spacing?: number
  ref?: Ref<HTMLDivElement>
}
export interface ToggleGroupSingleProps extends ToggleGroupCommonProps { multiple?: false; value?: string; defaultValue?: string; onChange?: (value: string, meta: ToggleGroupChangeMeta) => void }
export interface ToggleGroupMultipleProps extends ToggleGroupCommonProps { multiple: true; value?: string[]; defaultValue?: string[]; onChange?: (value: string[], meta: ToggleGroupChangeMeta) => void }
export type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps

export function ToggleGroup({ multiple = false, value, defaultValue, disabled = false, orientation = 'horizontal', spacing = 8, variant = 'default', size = 'default', className, style, ref, children, onChange, onKeyDown, ...props }: ToggleGroupProps) {
  const optionsRef = useRef({ multiple, value: value as ToggleGroupValue | undefined, defaultValue: defaultValue as ToggleGroupValue | undefined, disabled, onChange })
  Object.assign(optionsRef.current, { multiple, value, defaultValue, disabled, onChange })
  const controllerRef = useLazyRef(() => createToggleGroupController({
    get multiple() { return optionsRef.current.multiple }, get value() { return optionsRef.current.value }, get defaultValue() { return optionsRef.current.defaultValue }, get disabled() { return optionsRef.current.disabled },
    onChange(next, meta) { (optionsRef.current.onChange as ((value: ToggleGroupValue, meta: ToggleGroupChangeMeta) => void) | undefined)?.(next, meta) },
  }))
  const snapshot = useCoreStore(controllerRef.current)
  const context: ToggleGroupContextValue = { disabled, variant, size, isPressed: (item) => snapshot.value.includes(item), toggle: (item) => { controllerRef.current.toggle(item) } }
  const groupStyle = { ...style, gap: spacing > 0 ? spacing : undefined } as CSSProperties
  return <ToggleGroupContext value={context}><div {...props} ref={ref} role="group" aria-orientation={orientation} data-slot="toggle-group" data-orientation={orientation} data-variant={variant} data-disabled={disabled ? 'true' : undefined} className={cn(toggleGroupClassName({ orientation, variant, connected: spacing === 0 }), className)} style={groupStyle} onKeyDown={(event) => { onKeyDown?.(event); if (event.defaultPrevented) return; const items = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[data-slot=toggle]:not(:disabled)')]; const index = items.indexOf(event.target as HTMLButtonElement); const next = getToggleGroupFocusIndex(event.key, index, items.length, orientation); if (next === undefined || next === index) return; event.preventDefault(); items[next]?.focus() }}>{children}</div></ToggleGroupContext>
}
