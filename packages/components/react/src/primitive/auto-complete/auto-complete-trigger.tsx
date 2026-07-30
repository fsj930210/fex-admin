import { type ComponentProps, type KeyboardEvent, type ReactNode } from 'react'
import { LoadingIcon } from '../../icon/loading'
import {
  InputClear,
  InputControl,
  InputRoot,
  InputSuffix,
  type InputRootProps,
} from '../input/input'
import { PopoverTrigger } from '../popover/popover'
import { useAutoComplete } from './use-auto-complete'

export interface AutoCompleteTriggerProps
  extends Omit<ComponentProps<'input'>, 'children' | 'defaultValue' | 'disabled' | 'readOnly' | 'value'> {
  children?: (bindings: ReturnType<typeof useAutoComplete>) => ReactNode
  className?: string
  clearable?: boolean
  invalid?: boolean
  status?: InputRootProps['status']
  prefix?: ReactNode
  suffix?: ReactNode
}

export function AutoCompleteTrigger({
  children,
  className,
  clearable,
  invalid,
  status,
  prefix,
  suffix,
  onBlur,
  onFocus,
  onKeyDown,
  ...controlProps
}: AutoCompleteTriggerProps) {
  const autoComplete = useAutoComplete()
  if (children) return children(autoComplete)
  function keydown(event: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      autoComplete.controller.setOpen(true, 'keyboard')
      autoComplete.controller.moveActive(event.key === 'ArrowDown' ? 1 : -1)
    } else if (event.key === 'Enter' && autoComplete.snapshot.open) {
      if (autoComplete.controller.selectActive()) event.preventDefault()
    } else if (event.key === 'Escape') autoComplete.controller.setOpen(false, 'escape')
  }
  return (
    <PopoverTrigger>
      {(trigger) => (
        <InputRoot
          ref={trigger.ref as never}
          className={className}
          value={autoComplete.snapshot.value}
          disabled={autoComplete.disabled}
          readOnly={autoComplete.readOnly}
          invalid={invalid}
          status={status}
          onValueChange={(value) => {
            autoComplete.controller.setValue(value)
            autoComplete.controller.setOpen(true, 'input')
          }}
          onClear={autoComplete.controller.clear}
        >
          {prefix}
          <InputControl
            {...controlProps}
            role="combobox"
            aria-expanded={autoComplete.snapshot.open}
            aria-controls={autoComplete.listId}
            aria-activedescendant={autoComplete.activeId}
            onFocus={(event) => {
              onFocus?.(event)
              if (!event.defaultPrevented) autoComplete.controller.setOpen(true, 'focus')
            }}
            onBlur={(event) => {
              onBlur?.(event)
              if (!event.defaultPrevented) autoComplete.controller.setOpen(false, 'blur')
            }}
            onKeyDown={keydown}
          />
          {clearable ? <InputClear /> : null}
          <InputSuffix>{autoComplete.loading ? <LoadingIcon className="animate-spin" /> : suffix}</InputSuffix>
        </InputRoot>
      )}
    </PopoverTrigger>
  )
}
