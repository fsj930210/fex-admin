import { createCheckboxController } from '@fex/components-core/checkbox/create-checkbox-controller'
import type {
  CheckboxChangeMeta,
  CheckboxCheckedState,
} from '@fex/components-core/checkbox/types'
import {
  createContext,
  use,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type Ref,
} from 'react'
import { useCoreStore } from '../../hooks/use-core-store'
import { useLazyRef } from '../../hooks/use-lazy-ref'

export type { CheckboxChangeMeta, CheckboxCheckedState } from '@fex/components-core/checkbox/types'

export interface CheckboxRootProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'checked' | 'defaultChecked' | 'onChange' | 'type'
  > {
  checked?: CheckboxCheckedState
  defaultChecked?: CheckboxCheckedState
  ref?: Ref<HTMLButtonElement>
  onCheckedChange?: (checked: CheckboxCheckedState, meta: CheckboxChangeMeta) => void
}

export interface CheckboxIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  forceMount?: boolean
}

export interface CheckboxGroupProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

interface CheckboxContextValue {
  checked: CheckboxCheckedState
}

const CheckboxContext = createContext<CheckboxContextValue | null>(null)

function getAriaChecked(checked: CheckboxCheckedState) {
  return checked === 'indeterminate' ? 'mixed' : checked
}

export function CheckboxRoot({
  checked,
  defaultChecked,
  disabled,
  className,
  ref,
  children,
  onCheckedChange,
  onClick,
  ...props
}: CheckboxRootProps) {
  const optionsRef = useRef({ checked, defaultChecked, disabled })
  Object.assign(optionsRef.current, { checked, defaultChecked, disabled })
  const controllerRef = useLazyRef(() => createCheckboxController(optionsRef.current))
  const snapshot = useCoreStore(controllerRef.current)
  const currentChecked = checked ?? snapshot.checked
  const currentDisabled = disabled ?? snapshot.disabled
  const state = currentChecked === 'indeterminate' ? 'indeterminate' : currentChecked ? 'checked' : 'unchecked'

  return (
    <CheckboxContext value={{ checked: currentChecked }}>
      <button
        {...props}
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={getAriaChecked(currentChecked)}
        disabled={currentDisabled}
        data-state={state}
        data-disabled={currentDisabled ? 'true' : undefined}
        className={className}
        onClick={(event) => {
          onClick?.(event)
          if (event.defaultPrevented) {
            return
          }
          if (currentDisabled) return
          const meta =
            checked === undefined
              ? controllerRef.current.toggle()
              : {
                  previousChecked: currentChecked,
                  checked: currentChecked === true ? false : true,
                }
          if (meta === undefined) {
            return
          }
          onCheckedChange?.(meta.checked, meta)
        }}
      >
        {children}
      </button>
    </CheckboxContext>
  )
}

export function CheckboxIndicator({
  forceMount = false,
  className,
  children,
  ...props
}: CheckboxIndicatorProps) {
  const context = use(CheckboxContext)
  const checked = context?.checked ?? false

  if (!forceMount && checked === false) {
    return null
  }

  return (
    <span
      {...props}
      className={className}
      data-state={checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked'}
    >
      {children}
    </span>
  )
}

export function CheckboxGroup({ ref, ...props }: CheckboxGroupProps) {
  return <div {...props} ref={ref} />
}
