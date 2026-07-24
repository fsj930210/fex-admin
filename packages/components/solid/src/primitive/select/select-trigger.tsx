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
  createMemo,
  createSignal,
  createUniqueId,
  For,
  Show,
  splitProps,
  type JSX,
  type ParentProps,
} from 'solid-js'
import { CheckIcon } from '../../icon/check'
import { ChevronDownIcon } from '../../icon/chevron'
import { CloseIcon } from '../../icon/close'
import { LoadingIcon } from '../../icon/loading'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'
import { Button } from '../button/button'
import { Popover, PopoverContent, PopoverPortal, PopoverTrigger } from '../popover/popover'
import { SelectContext, useSelect } from './select-context'

export interface SelectTriggerProps extends ParentProps<
  Omit<JSX.HTMLAttributes<HTMLDivElement>, 'prefix'>
> {
  prefix?: JSX.Element
  suffix?: JSX.Element
  placeholder?: string
  maxTagCount?: number
  tagRender?: (
    option: SelectOption,
    context: { remove: () => void; disabled: boolean },
  ) => JSX.Element
}
export function SelectTrigger(props: SelectTriggerProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'children',
    'prefix',
    'suffix',
    'placeholder',
    'maxTagCount',
    'tagRender',
    'onKeyDown',
  ])
  const select = useSelect('SelectTrigger')
  function keydown(event: KeyboardEvent) {
    if (typeof local.onKeyDown === 'function') local.onKeyDown(event as never)
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
    } else if (event.key === 'Backspace' && !select.snapshot().searchValue)
      select.controller.removeLastSelected()
    else if (event.key === 'Escape') select.controller.close()
  }
  return (
    <PopoverTrigger>
      {(trigger) => (
        <div
          {...rest}
          {...(trigger.props as unknown as JSX.HTMLAttributes<HTMLDivElement>)}
          ref={trigger.ref as never}
          role={undefined}
          data-slot="select-trigger"
          data-disabled={select.disabled() || undefined}
          data-status={select.status()}
          aria-invalid={select.status() === 'error' || undefined}
          class={cn(selectTriggerClassName(), local.class)}
          onKeyDown={keydown}
        >
          {local.prefix}
          <div class={selectValueContainerClassName}>
            <SelectValue
              maxTagCount={local.maxTagCount}
              placeholder={select.showSearch() ? undefined : local.placeholder}
              tagRender={local.tagRender}
            >
              {local.children}
            </SelectValue>
            <input
              role="combobox"
              aria-expanded={select.snapshot().open}
              aria-controls={select.listId}
              disabled={select.disabled()}
              readOnly={!select.showSearch()}
              placeholder={
                select.showSearch() && !select.selectedOptions().length
                  ? local.placeholder
                  : undefined
              }
              value={select.snapshot().searchValue}
              class={selectInputClassName}
              onFocus={() => select.controller.open()}
              onPointerDown={(event) => {
                if (document.activeElement === event.currentTarget) select.controller.toggleOpen()
                else select.controller.open()
              }}
              onClick={(event) => {
                event.stopPropagation()
              }}
              onInput={(event) => {
                select.controller.setSearchValue(event.currentTarget.value)
                select.controller.open()
              }}
            />
          </div>
          <span data-slot="select-suffix" class={selectSuffixClassName}>
            <Show when={!select.loading()} fallback={<LoadingIcon class="animate-spin" />}>
              <Show
                when={select.clearable() && select.selectedOptions().length}
                fallback={local.suffix ?? (
                  <span
                    data-state={select.snapshot().open ? 'open' : 'closed'}
                    class={selectIndicatorClassName}
                  >
                    <ChevronDownIcon />
                  </span>
                )}
              >
                <Button
                  type="button"
                  aria-label="Clear selection"
                  class={selectClearClassName}
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={(event) => {
                    event.stopPropagation()
                    select.controller.clear()
                  }}
                >
                  <CloseIcon class="size-4" />
                </Button>
              </Show>
            </Show>
          </span>
        </div>
      )}
    </PopoverTrigger>
  )
}
export function SelectValue(props: {
  children?: JSX.Element | undefined
  placeholder?: string | undefined
  maxTagCount?: number | undefined
  tagRender?: SelectTriggerProps['tagRender'] | undefined
  class?: string | undefined
}) {
  const select = useSelect('SelectValue')
  const visible = () =>
    props.maxTagCount === undefined
      ? select.selectedOptions()
      : select.selectedOptions().slice(0, Math.max(0, props.maxTagCount))
  return (
    <Show
      when={!props.children}
      fallback={<div class={cn(selectValueClassName, props.class)}>{props.children}</div>}
    >
      <Show
        when={select.selectedOptions().length}
        fallback={
          <Show when={!select.snapshot().searchValue}>
            <span class={selectPlaceholderClassName}>{props.placeholder}</span>
          </Show>
        }
      >
        <Show
          when={select.multiple()}
          fallback={<div class={selectValueClassName}>{select.selectedOptions()[0]?.label}</div>}
        >
          <div class={selectValueClassName}>
            <For each={visible()}>
              {(option) =>
                props.tagRender ? (
                  <span>
                    {props.tagRender(option, {
                      remove: () => select.removeValue(option.value),
                      disabled: option.disabled === true,
                    })}
                  </span>
                ) : (
                  <span class={selectTagClassName}>
                    {option.label}
                    <button
                      type="button"
                      class={selectTagRemoveClassName}
                      onPointerDown={(event) => event.preventDefault()}
                      onClick={(event) => {
                        event.stopPropagation()
                        select.removeValue(option.value)
                      }}
                    >
                      <CloseIcon />
                    </button>
                  </span>
                )
              }
            </For>
            <Show when={select.selectedOptions().length - visible().length > 0}>
              <span class={selectTagOverflowClassName}>
                +{select.selectedOptions().length - visible().length}
              </span>
            </Show>
          </div>
        </Show>
      </Show>
    </Show>
  )
}
