import { createCheckboxController } from '@fex/components-core/checkbox/create-checkbox-controller'
import type { CheckboxChangeMeta, CheckboxCheckedState } from '@fex/components-core/checkbox/types'
import { createContext, splitProps, useContext, type JSX, type ParentProps } from 'solid-js'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'

export type { CheckboxChangeMeta, CheckboxCheckedState } from '@fex/components-core/checkbox/types'

interface CheckboxContextValue {
  checked: () => CheckboxCheckedState
}

const CheckboxContext = createContext<CheckboxContextValue>()

export interface CheckboxRootProps
  extends ParentProps<Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onChange'>> {
  checked?: CheckboxCheckedState
  defaultChecked?: CheckboxCheckedState
  onCheckedChange?: (checked: CheckboxCheckedState, meta: CheckboxChangeMeta) => void
}

export function CheckboxRoot(props: CheckboxRootProps) {
  const [local, rest] = splitProps(props, ['checked', 'defaultChecked', 'disabled', 'children', 'onClick', 'onCheckedChange'])
  const options = {
    get checked() {
      return local.checked
    },
    get defaultChecked() {
      return local.defaultChecked
    },
    get disabled() {
      return local.disabled
    },
  }
  const controller = createCheckboxController(options)
  const snapshot = createCoreStoreSignal(controller)
  const currentChecked = () => local.checked ?? snapshot().checked
  const currentDisabled = () => local.disabled === true || snapshot().disabled
  const state = () => currentChecked() === 'indeterminate' ? 'indeterminate' : currentChecked() ? 'checked' : 'unchecked'
  const ariaChecked = (): boolean | 'mixed' => {
    const checked = currentChecked()
    return checked === 'indeterminate' ? 'mixed' : checked
  }

  return (
    <CheckboxContext.Provider value={{ checked: currentChecked }}>
      <button
        {...rest}
        type="button"
        role="checkbox"
        disabled={currentDisabled()}
        aria-checked={ariaChecked()}
        data-state={state()}
        data-disabled={currentDisabled() ? 'true' : undefined}
        onClick={(event) => {
          if (typeof local.onClick === 'function') {
            local.onClick(event)
          }
          if (event.defaultPrevented) return
          if (currentDisabled()) return
          const meta =
            local.checked === undefined
              ? controller.toggle()
              : {
                  previousChecked: currentChecked(),
                  checked: currentChecked() !== true,
                }
          if (meta === undefined) {
            return
          }
          local.onCheckedChange?.(meta.checked, meta)
        }}
      >
        {local.children}
      </button>
    </CheckboxContext.Provider>
  )
}

export interface CheckboxIndicatorProps extends ParentProps<JSX.HTMLAttributes<HTMLSpanElement>> {
  forceMount?: boolean
}

export function CheckboxIndicator(props: CheckboxIndicatorProps) {
  const context = useContext(CheckboxContext)
  const [local, rest] = splitProps(props, ['forceMount', 'children'])
  const checked = () => context?.checked() ?? false
  const state = () => checked() === 'indeterminate' ? 'indeterminate' : checked() ? 'checked' : 'unchecked'

  return (
    <>
      {(local.forceMount || checked() !== false) && (
        <span {...rest} data-state={state()}>
          {local.children}
        </span>
      )}
    </>
  )
}

export function CheckboxGroup(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  return <div {...props}>{props.children}</div>
}
