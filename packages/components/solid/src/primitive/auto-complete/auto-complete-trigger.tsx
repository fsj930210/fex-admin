import { splitProps, type JSX, type ParentProps } from 'solid-js'
import { LoadingIcon } from '../../icon/loading'
import { InputClear, InputControl, InputRoot, InputSuffix } from '../input/input'
import { PopoverTrigger } from '../popover/popover'
import { useAutoComplete } from './context'

export interface AutoCompleteTriggerProps
  extends ParentProps<Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'disabled' | 'readOnly'>> {
  class?: string
  clearable?: boolean
  invalid?: boolean
  status?: 'error' | 'warning'
  prefix?: JSX.Element
  suffix?: JSX.Element
}
export function AutoCompleteTrigger(props: AutoCompleteTriggerProps) {
  const autoComplete = useAutoComplete('AutoCompleteTrigger')
  const [local, controlProps] = splitProps(props, [
    'children', 'class', 'clearable', 'invalid', 'status', 'prefix', 'suffix', 'onBlur', 'onFocus', 'onKeyDown',
  ])
  function keydown(event: KeyboardEvent & { currentTarget: HTMLInputElement }) {
    if (typeof local.onKeyDown === 'function') local.onKeyDown(event)
    if (event.defaultPrevented) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      autoComplete.controller.setOpen(true, 'keyboard')
      autoComplete.controller.moveActive(event.key === 'ArrowDown' ? 1 : -1)
    } else if (event.key === 'Enter' && autoComplete.snapshot().open) {
      if (autoComplete.controller.selectActive()) event.preventDefault()
    } else if (event.key === 'Escape') autoComplete.controller.setOpen(false, 'escape')
  }
  return (
    <PopoverTrigger>
      {(trigger) => (
        <InputRoot
          ref={trigger.ref as never}
          class={local.class}
          value={autoComplete.snapshot().value}
          disabled={autoComplete.disabled()}
          readOnly={autoComplete.readOnly()}
          invalid={local.invalid}
          status={local.status}
          onValueChange={(value) => {
            autoComplete.controller.setValue(value)
            autoComplete.controller.setOpen(true, 'input')
          }}
          onClear={autoComplete.controller.clear}
        >
          {local.prefix}
          <InputControl
            {...controlProps}
            role="combobox"
            aria-expanded={autoComplete.snapshot().open}
            aria-controls={autoComplete.listId}
            aria-activedescendant={autoComplete.snapshot().activeKey === undefined ? undefined : `${autoComplete.listId}-${autoComplete.snapshot().activeKey}`}
            onFocus={(event) => {
              if (typeof local.onFocus === 'function') local.onFocus(event)
              if (!event.defaultPrevented) autoComplete.controller.setOpen(true, 'focus')
            }}
            onBlur={(event) => {
              if (typeof local.onBlur === 'function') local.onBlur(event)
              if (!event.defaultPrevented) autoComplete.controller.setOpen(false, 'blur')
            }}
            onKeyDown={keydown}
          />
          {local.clearable ? <InputClear /> : null}
          {(autoComplete.loading() || local.suffix) && <InputSuffix>{autoComplete.loading() ? <LoadingIcon class="animate-spin" /> : local.suffix}</InputSuffix>}
        </InputRoot>
      )}
    </PopoverTrigger>
  )
}
