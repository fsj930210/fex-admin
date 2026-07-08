import { switchClassName, switchThumbClassName, type SwitchStyleProps } from '@fex/components-styles/switch'
import { cn } from '@fex/utils'
import { createContext, createSignal, splitProps, useContext, type Accessor, type JSX } from 'solid-js'

export type SwitchState = 'checked' | 'unchecked'

interface SwitchContextValue {
  checked: Accessor<boolean>
  state: Accessor<SwitchState>
  size: Accessor<SwitchStyleProps['size']>
}

const SwitchContext = createContext<SwitchContextValue>()

function useSwitchContext(componentName: string) {
  const context = useContext(SwitchContext)
  if (!context) {
    throw new Error(`${componentName} must be used inside SwitchRoot.`)
  }
  return context
}

export interface SwitchRootProps
  extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'checked' | 'defaultChecked' | 'onChange' | 'role' | 'type'>,
    SwitchStyleProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean, event: MouseEvent) => void
}

export function SwitchRoot(props: SwitchRootProps) {
  const [local, rest] = splitProps(props, ['checked', 'defaultChecked', 'disabled', 'size', 'class', 'onClick', 'onCheckedChange', 'children'])
  const [internalChecked, setInternalChecked] = createSignal(local.defaultChecked ?? false)
  const currentChecked = () => local.checked ?? internalChecked()
  const state = (): SwitchState => (currentChecked() ? 'checked' : 'unchecked')
  const size = () => local.size ?? 'default'

  return (
    <SwitchContext.Provider value={{ checked: currentChecked, state, size }}>
      <button
        {...rest}
        type="button"
        role="switch"
        disabled={local.disabled}
        aria-checked={currentChecked()}
        data-state={state()}
        data-disabled={local.disabled ? 'true' : undefined}
        class={cn(switchClassName({ size: size() }), local.class)}
        onClick={(event) => {
          if (typeof local.onClick === 'function') local.onClick(event)
          if (event.defaultPrevented || local.disabled) return
          const nextChecked = !currentChecked()
          if (local.checked === undefined) setInternalChecked(nextChecked)
          local.onCheckedChange?.(nextChecked, event)
        }}
      >
        {local.children}
      </button>
    </SwitchContext.Provider>
  )
}

export interface SwitchThumbProps extends JSX.HTMLAttributes<HTMLSpanElement>, SwitchStyleProps {}

export function SwitchThumb(props: SwitchThumbProps) {
  const [local, rest] = splitProps(props, ['size', 'class'])
  const context = useSwitchContext('SwitchThumb')
  const size = () => local.size ?? context.size()

  return <span {...rest} data-state={context.state()} class={cn(switchThumbClassName({ size: size() }), local.class)} />
}
