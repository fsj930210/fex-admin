import { createToggleGroupController } from '@fex-design/core/toggle/create-toggle-group-controller'
import { getToggleGroupFocusIndex, type ToggleGroupChangeMeta, type ToggleGroupValue } from '@fex-design/core/toggle/types'
import { toggleClassName, toggleGroupClassName, type ToggleStyleProps } from '@fex-design/styles/toggle'
import { cn } from '@fex/utils'
import { createContext, createSignal, splitProps, useContext, type JSX, type ParentProps } from 'solid-js'
import { Button } from '../button/button'

type GroupContext = { disabled: () => boolean; variant: () => ToggleStyleProps['variant']; size: () => ToggleStyleProps['size']; isPressed: (value: string) => boolean; toggle: (value: string) => void }
const ToggleGroupContext = createContext<GroupContext>()

export interface ToggleProps extends ParentProps<Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'>>, ToggleStyleProps { pressed?: boolean; defaultPressed?: boolean; value?: string; onChange?: (pressed: boolean) => void }
export function Toggle(props: ToggleProps) {
  const [local, rest] = splitProps(props, ['pressed', 'defaultPressed', 'value', 'disabled', 'variant', 'size', 'class', 'onClick', 'onChange'])
  const group = useContext(ToggleGroupContext)
  const [internal, setInternal] = createSignal(local.defaultPressed ?? false)
  const inGroup = () => group !== undefined && local.value !== undefined
  const current = () => inGroup() ? group!.isPressed(local.value!) : (local.pressed ?? internal())
  const currentDisabled = () => Boolean(local.disabled || group?.disabled())
  return <Button {...rest} disabled={currentDisabled()} aria-pressed={current()} data-slot="toggle" data-state={current() ? 'on' : 'off'} data-value={local.value} class={cn(toggleClassName({ variant: local.variant ?? group?.variant(), size: local.size ?? group?.size() }), local.class)} onClick={(event) => {
    if (typeof local.onClick === 'function') local.onClick(event)
    if (event.defaultPrevented || currentDisabled()) return
    if (inGroup()) group!.toggle(local.value!)
    else { const next = !current(); if (local.pressed === undefined) setInternal(next); local.onChange?.(next) }
  }} />
}

interface Common extends ParentProps<Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'>>, ToggleStyleProps { disabled?: boolean; orientation?: 'horizontal' | 'vertical'; spacing?: number }
export type ToggleGroupProps = Common & ({ multiple?: false; value?: string; defaultValue?: string; onChange?: (value: string, meta: ToggleGroupChangeMeta) => void } | { multiple: true; value?: string[]; defaultValue?: string[]; onChange?: (value: string[], meta: ToggleGroupChangeMeta) => void })
export function ToggleGroup(props: ToggleGroupProps) {
  const [local, rest] = splitProps(props, ['multiple', 'value', 'defaultValue', 'disabled', 'orientation', 'spacing', 'variant', 'size', 'class', 'style', 'children', 'onChange', 'onKeyDown'])
  const controller = createToggleGroupController({ get multiple() { return local.multiple }, get value() { return local.value as ToggleGroupValue | undefined }, get defaultValue() { return local.defaultValue as ToggleGroupValue | undefined }, get disabled() { return local.disabled }, onChange(value, meta) { (local.onChange as ((value: ToggleGroupValue, meta: ToggleGroupChangeMeta) => void) | undefined)?.(value, meta) } })
  const [version, setVersion] = createSignal(0)
  controller.subscribe(() => setVersion((value) => value + 1))
  const context: GroupContext = { disabled: () => local.disabled ?? false, variant: () => local.variant ?? 'default', size: () => local.size ?? 'default', isPressed: (value) => { version(); return controller.isPressed(value) }, toggle: (value) => controller.toggle(value) }
  const spacing = () => local.spacing ?? 8
  return <ToggleGroupContext.Provider value={context}><div {...rest} role="group" aria-orientation={local.orientation ?? 'horizontal'} data-slot="toggle-group" data-orientation={local.orientation ?? 'horizontal'} data-variant={local.variant ?? 'default'} data-disabled={local.disabled ? 'true' : undefined} class={cn(toggleGroupClassName({ orientation: local.orientation ?? 'horizontal', variant: local.variant ?? 'default', connected: spacing() === 0 }), local.class)} style={{ ...(local.style as JSX.CSSProperties), gap: spacing() > 0 ? `${spacing()}px` : undefined }} onKeyDown={(event) => { if (typeof local.onKeyDown === 'function') local.onKeyDown(event); if (event.defaultPrevented) return; const items = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[data-slot=toggle]:not(:disabled)')]; const index = items.indexOf(event.target as HTMLButtonElement); const next = getToggleGroupFocusIndex(event.key, index, items.length, local.orientation ?? 'horizontal'); if (next === undefined || next === index) return; event.preventDefault(); items[next]?.focus() }}>{local.children}</div></ToggleGroupContext.Provider>
}
