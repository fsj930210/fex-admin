import { createSelectController } from '@fex/components-core/select/create-select-controller'
import { filterSelectOptions, groupSelectOptions } from '@fex/components-core/select/filter-options'
import { getSelectVirtualRange } from '@fex/components-core/select/virtual'
import type {
  SelectFilterOption,
  SelectMode,
  SelectOption,
  SelectVirtualOptions,
} from '@fex/components-core/select/types'
import { createSelectionController } from '@fex/components-core/selection/create-selection-controller'
import type { SelectionValue } from '@fex/components-core/selection/types'
import {
  selectClearClassName,
  selectContentClassName,
  selectEmptyClassName,
  selectGroupLabelClassName,
  selectIndicatorClassName,
  selectInputClassName,
  selectListClassName,
  selectLoadingClassName,
  selectOptionClassName,
  selectOptionIndicatorClassName,
  selectOptionLabelClassName,
  selectPlaceholderClassName,
  selectSuffixClassName,
  selectTagClassName,
  selectTagOverflowClassName,
  selectTagRemoveClassName,
  selectTriggerClassName,
  selectValueClassName,
  selectValueContainerClassName,
} from '@fex/components-styles/select'
import { cn } from '@fex/utils'
import {
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
  useId,
  useRef,
  useState,
} from 'react'
import { ChevronDownIcon } from '../../icon/chevron'
import { CheckIcon } from '../../icon/check'
import { LoadingIcon } from '../../icon/loading'
import { CloseIcon } from '../../icon/close'
import { useCoreStore } from '../../hooks/use-core-store'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'
import { InputClearButton } from '../input/input'
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from '../popover/popover'
import { SelectContext } from './select-context'
import { useSelect, useSelectOption } from './use-select'

export interface SelectTriggerProps extends Omit<ComponentProps<'div'>, 'children' | 'prefix'> {
  children?: ReactNode
  prefix?: ReactNode
  maxTagCount?: number
  placeholder?: string
  suffix?: ReactNode
  tagRender?: (
    option: SelectOption,
    context: { remove: () => void; disabled: boolean },
  ) => ReactNode
}

export function SelectTrigger({
  children,
  prefix,
  suffix,
  tagRender,
  maxTagCount,
  placeholder,
  className,
  onKeyDown,
  ...props
}: SelectTriggerProps) {
  const select = useSelect()
  const hasValue = select.selection.values.length > 0
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      select.controller.open()
      select.controller.moveActive(event.key === 'ArrowDown' ? 1 : -1)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      select.controller.moveActiveTo(event.key === 'Home' ? 'first' : 'last')
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (!select.controller.selectActive()) select.controller.createTag()
    } else if (event.key === 'Backspace' && !select.snapshot.searchValue)
      select.controller.removeLastSelected()
    else if (event.key === 'Escape') select.controller.close()
  }
  return (
    <PopoverTrigger>
      {(triggerProps) => (
        <div
          {...props}
          {...(triggerProps as ComponentProps<'div'>)}
          role={undefined}
          data-slot="select-trigger"
          data-disabled={select.disabled ? 'true' : undefined}
          data-status={select.status}
          aria-invalid={select.status === 'error' || undefined}
          className={cn(selectTriggerClassName(), className)}
          onKeyDown={handleKeyDown}
        >
          {prefix}
          <div className={selectValueContainerClassName}>
            <SelectValue
              maxTagCount={maxTagCount}
              placeholder={select.showSearch ? undefined : placeholder}
              tagRender={tagRender}
            >
              {children}
            </SelectValue>
            <input
              role="combobox"
              aria-expanded={select.snapshot.open}
              aria-controls={select.listId}
              aria-activedescendant={
                select.snapshot.activeValue === undefined
                  ? undefined
                  : `${select.listId}-${select.snapshot.activeValue}`
              }
              disabled={select.disabled}
              readOnly={!select.showSearch}
              placeholder={select.showSearch && !hasValue ? placeholder : undefined}
              value={select.snapshot.searchValue}
              className={selectInputClassName}
              onFocus={() => select.controller.open()}
              onPointerDown={(event) => {
                if (document.activeElement === event.currentTarget) select.controller.toggleOpen()
                else select.controller.open()
              }}
              onClick={(event) => {
                event.stopPropagation()
              }}
              onChange={(event) => {
                select.controller.setSearchValue(event.currentTarget.value)
                select.controller.open()
              }}
            />
          </div>
          <span data-slot="select-suffix" className={selectSuffixClassName}>
            {select.loading ? (
              <LoadingIcon className="animate-spin" />
            ) : select.clearable && hasValue ? (
              <InputClearButton
                data-slot="select-clear"
                aria-label="Clear selection"
                className={selectClearClassName}
                onClick={(event) => {
                  event.stopPropagation()
                  select.controller.clear()
                }}
              >
                <CloseIcon className="size-4" />
              </InputClearButton>
            ) : suffix ? (
              suffix
            ) : (
              <span
                data-state={select.snapshot.open ? 'open' : 'closed'}
                className={selectIndicatorClassName}
              >
                <ChevronDownIcon aria-hidden />
              </span>
            )}
          </span>
        </div>
      )}
    </PopoverTrigger>
  )
}

export interface SelectValueProps extends ComponentProps<'div'> {
  maxTagCount?: number | undefined
  placeholder?: string | undefined
  tagRender?:
    | ((option: SelectOption, context: { remove: () => void; disabled: boolean }) => ReactNode)
    | undefined
}

export function SelectValue({
  children,
  maxTagCount,
  placeholder,
  tagRender,
  className,
  ...props
}: SelectValueProps) {
  const select = useSelect()
  if (children)
    return (
      <div {...props} className={cn(selectValueClassName, className)}>
        {children}
      </div>
    )
  if (!select.selectedOptions.length)
    return select.snapshot.searchValue ? null : (
      <span className={selectPlaceholderClassName}>{placeholder ?? select.placeholder}</span>
    )
  if (!select.multiple)
    return (
      <div {...props} className={cn(selectValueClassName, className)}>
        {select.selectedOptions[0]?.label}
      </div>
    )
  const visibleOptions =
    maxTagCount === undefined
      ? select.selectedOptions
      : select.selectedOptions.slice(0, Math.max(0, maxTagCount))
  const overflowCount = select.selectedOptions.length - visibleOptions.length
  return (
    <div {...props} className={cn(selectValueClassName, className)}>
      {visibleOptions.map((option) =>
        tagRender ? (
          <span key={option.value}>
            {tagRender(option, {
              remove: () => select.removeValue(option.value),
              disabled: option.disabled === true,
            })}
          </span>
        ) : (
          <span key={option.value} className={selectTagClassName}>
            {option.label}
            <button
              type="button"
              className={selectTagRemoveClassName}
              onPointerDown={(event) => event.preventDefault()}
              onClick={(event) => {
                event.stopPropagation()
                select.removeValue(option.value)
              }}
            >
              <CloseIcon />
            </button>
          </span>
        ),
      )}
      {overflowCount > 0 ? (
        <span className={selectTagOverflowClassName}>+{overflowCount}</span>
      ) : null}
    </div>
  )
}
