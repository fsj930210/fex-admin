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

export interface SelectContentProps extends ComponentProps<'div'> {
  popupRender?: (menu: ReactNode, context: { close: () => void }) => ReactNode
}

export function SelectContent({ className, children, popupRender, ...props }: SelectContentProps) {
  const select = useSelect()
  const menu = children ?? <SelectList />
  return (
    <PopoverPortal>
      <PopoverContent
        {...props}
        role={undefined}
        className={cn(selectContentClassName, className)}
        style={{
          width: 'var(--select-content-width, var(--floating-reference-width))',
          maxWidth:
            'min(var(--floating-available-width), var(--select-content-max-width, var(--floating-reference-width)))',
          ...props.style,
        }}
      >
        {popupRender ? popupRender(menu, { close: select.controller.close }) : menu}
      </PopoverContent>
    </PopoverPortal>
  )
}

export interface SelectListProps extends ComponentProps<'div'> {
  optionRender?: (
    option: SelectOption,
    state: { selected: boolean; active: boolean; disabled: boolean },
  ) => ReactNode
}

export function SelectList({ className, children, optionRender, ...props }: SelectListProps) {
  const select = useSelect()
  const groups = groupSelectOptions(select.visibleOptions)
  const [viewport, setViewport] = useState({ scrollTop: 0, height: 320 })
  if (select.virtual && !children) {
    const range = getSelectVirtualRange(
      select.visibleOptions.length,
      viewport.scrollTop,
      viewport.height,
      select.virtual,
    )
    const items = select.visibleOptions.slice(range.start, range.end)
    return (
      <div
        {...props}
        id={select.listId}
        role="listbox"
        aria-multiselectable={select.multiple || undefined}
        className={cn(selectListClassName, className)}
        onScroll={(event) => {
          props.onScroll?.(event)
          if (!event.defaultPrevented)
            setViewport({
              scrollTop: event.currentTarget.scrollTop,
              height: event.currentTarget.clientHeight,
            })
        }}
      >
        <div style={{ height: range.totalSize, position: 'relative' }}>
          <div style={{ position: 'absolute', insetInline: 0, top: range.offset }}>
            {items.map((option) => (
              <SelectOption key={option.value} option={option} render={optionRender} />
            ))}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div
      {...props}
      id={select.listId}
      role="listbox"
      aria-multiselectable={select.multiple || undefined}
      className={cn(selectListClassName, className)}
    >
      {children ??
        groups.map((group) => (
          <SelectGroup key={group.label ?? ''} label={group.label}>
            {group.options.map((option) => (
              <SelectOption key={option.value} option={option} render={optionRender} />
            ))}
          </SelectGroup>
        ))}
    </div>
  )
}

export function SelectOption({
  option,
  render,
  className,
  children,
  ...props
}: Omit<ComponentProps<'div'>, 'children'> & {
  option: SelectOption
  children?: ReactNode
  render?: SelectListProps['optionRender']
}) {
  const select = useSelect()
  const state = useSelectOption(option.value)
  return (
    <div
      {...props}
      id={`${select.listId}-${option.value}`}
      role="option"
      aria-selected={state.selected}
      aria-disabled={state.disabled || undefined}
      data-active={state.active ? 'true' : undefined}
      data-selected={state.selected ? 'true' : undefined}
      data-disabled={state.disabled ? 'true' : undefined}
      className={cn(selectOptionClassName, className)}
      onPointerMove={state.activate}
      onClick={state.select}
    >
      <span className={selectOptionLabelClassName}>
        {render?.(option, state) ?? children ?? option.label}
      </span>
      <span aria-hidden="true" className={selectOptionIndicatorClassName}>
        <CheckIcon />
      </span>
    </div>
  )
}

export function SelectGroup({
  label,
  children,
}: {
  label?: string | undefined
  children?: ReactNode
}) {
  return (
    <div role="group" aria-label={label}>
      {label && <div className={selectGroupLabelClassName}>{label}</div>}
      {children}
    </div>
  )
}
export function SelectEmpty({
  children = 'No options',
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div {...props} className={cn(selectEmptyClassName, className)}>
      {children}
    </div>
  )
}
export function SelectLoading({
  children = 'Loading...',
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div {...props} className={cn(selectLoadingClassName, className)}>
      {children}
    </div>
  )
}
