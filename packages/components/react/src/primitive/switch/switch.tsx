import { createToggleController } from '@fex/components-core/toggle/create-toggle-controller'
import { switchClassName, switchThumbClassName, type SwitchStyleProps } from '@fex/components-styles/switch'
import { cn } from '@fex/utils'
import { createContext, use, useRef, type ButtonHTMLAttributes, type HTMLAttributes, type MouseEvent, type ReactNode, type Ref } from 'react'
import { useCoreStore } from '../../hooks/use-core-store'
import { useLazyRef } from '../../hooks/use-lazy-ref'

export type SwitchState = 'checked' | 'unchecked'

interface SwitchContextValue {
  checked: boolean
  state: SwitchState
  size: SwitchStyleProps['size']
}

const SwitchContext = createContext<SwitchContextValue | null>(null)

function useSwitchContext(componentName: string) {
  const context = use(SwitchContext)
  if (!context) {
    throw new Error(`${componentName} must be used inside SwitchRoot.`)
  }
  return context
}

export interface SwitchRootProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'checked' | 'defaultChecked' | 'onChange' | 'role' | 'type'>,
    SwitchStyleProps {
  checked?: boolean
  defaultChecked?: boolean
  ref?: Ref<HTMLButtonElement>
  onCheckedChange?: (checked: boolean, event: MouseEvent<HTMLButtonElement>) => void
  children?: ReactNode
}

export function SwitchRoot({
  checked,
  defaultChecked = false,
  disabled,
  size = 'default',
  className,
  ref,
  onClick,
  onCheckedChange,
  children,
  ...props
}: SwitchRootProps) {
  const optionsRef = useRef({ checked, defaultChecked, disabled })
  Object.assign(optionsRef.current, { checked, defaultChecked, disabled })
  const controllerRef = useLazyRef(() => createToggleController(optionsRef.current))
  const snapshot = useCoreStore(controllerRef.current)
  const currentChecked = checked ?? snapshot.checked
  const currentDisabled = disabled ?? snapshot.disabled
  const state: SwitchState = currentChecked ? 'checked' : 'unchecked'

  return (
    <SwitchContext value={{ checked: currentChecked, state, size }}>
      <button
        {...props}
        ref={ref}
        type="button"
        role="switch"
        aria-checked={currentChecked}
        disabled={currentDisabled}
        data-state={state}
        data-disabled={currentDisabled ? 'true' : undefined}
        className={cn(switchClassName({ size }), className)}
        onClick={(event) => {
          onClick?.(event)
          if (event.defaultPrevented || currentDisabled) return
          const meta = checked === undefined
            ? controllerRef.current.toggle()
            : { previousChecked: currentChecked, checked: !currentChecked }
          if (meta === undefined) return
          onCheckedChange?.(meta.checked, event)
        }}
      >
        {children}
      </button>
    </SwitchContext>
  )
}

export interface SwitchThumbProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>
  size?: SwitchStyleProps['size']
}

export function SwitchThumb({ ref, size, className, ...props }: SwitchThumbProps) {
  const context = useSwitchContext('SwitchThumb')
  const resolvedSize = size ?? context.size

  return <span {...props} ref={ref} data-state={context.state} className={cn(switchThumbClassName({ size: resolvedSize }), className)} />
}
