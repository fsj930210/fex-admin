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

export function SelectContent(
  props: ParentProps<{
    class?: string
    popupRender?: (menu: JSX.Element, context: { close: () => void }) => JSX.Element
  }>,
) {
  const select = useSelect('SelectContent')
  const menu = () => props.children ?? <SelectList />
  return (
    <PopoverPortal>
      <PopoverContent
        class={cn(selectContentClassName, props.class)}
        style="width: var(--select-content-width, var(--floating-reference-width)); max-width: min(var(--floating-available-width), var(--select-content-max-width, var(--floating-reference-width)));"
      >
        {props.popupRender ? props.popupRender(menu(), { close: select.controller.close }) : menu()}
      </PopoverContent>
    </PopoverPortal>
  )
}
export function SelectList(
  props: ParentProps<{
    class?: string
    optionRender?: (
      option: SelectOption,
      state: { selected: boolean; active: boolean; disabled: boolean },
    ) => JSX.Element
  }>,
) {
  const select = useSelect('SelectList')
  const [viewport, setViewport] = createSignal({ scrollTop: 0, height: 320 })
  const range = createMemo(() =>
    select.virtual()
      ? getSelectVirtualRange(
          select.visibleOptions().length,
          viewport().scrollTop,
          viewport().height,
          select.virtual()!,
        )
      : undefined,
  )
  const render = (option: SelectOption) => (
    <SelectOptionView option={option} render={props.optionRender} />
  )
  return (
    <div
      id={select.listId}
      role="listbox"
      aria-multiselectable={select.multiple() || undefined}
      class={cn(selectListClassName, props.class)}
      onScroll={(event) =>
        setViewport({
          scrollTop: event.currentTarget.scrollTop,
          height: event.currentTarget.clientHeight,
        })
      }
    >
      <Show
        when={range()}
        fallback={
          <For each={groupSelectOptions(select.visibleOptions())}>
            {(group) => (
              <div role="group" aria-label={group.label}>
                {group.label && <div class={selectGroupLabelClassName}>{group.label}</div>}
                <For each={group.options}>{render}</For>
              </div>
            )}
          </For>
        }
      >
        {(current) => (
          <div style={{ height: `${current().totalSize}px`, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: '0', top: `${current().offset}px` }}>
              <For each={select.visibleOptions().slice(current().start, current().end)}>
                {render}
              </For>
            </div>
          </div>
        )}
      </Show>
    </div>
  )
}
function SelectOptionView(props: {
  option: SelectOption
  render?:
    | ((
        option: SelectOption,
        state: { selected: boolean; active: boolean; disabled: boolean },
      ) => JSX.Element)
    | undefined
}) {
  const select = useSelect('SelectOption')
  const state = () => ({
    selected: select.controller.selection.isSelected(props.option.value),
    active: select.snapshot().activeValue === props.option.value,
    disabled:
      props.option.disabled === true || select.controller.selection.isDisabled(props.option.value),
  })
  return (
    <div
      id={`${select.listId}-${props.option.value}`}
      role="option"
      aria-selected={state().selected}
      aria-disabled={state().disabled || undefined}
      data-active={state().active || undefined}
      data-selected={state().selected || undefined}
      data-disabled={state().disabled || undefined}
      class={selectOptionClassName}
      onPointerMove={() => select.controller.setActiveValue(props.option.value, 'pointer')}
      onPointerDown={(event) => event.preventDefault()}
      onClick={() => !state().disabled && select.controller.selectValue(props.option.value)}
    >
      <span class={selectOptionLabelClassName}>
        {props.render?.(props.option, state()) ?? props.option.label}
      </span>
      <span class={selectOptionIndicatorClassName}>
        <CheckIcon />
      </span>
    </div>
  )
}
export function SelectEmpty(props: ParentProps<{ class?: string }>) {
  return <div class={cn(selectEmptyClassName, props.class)}>{props.children ?? 'No options'}</div>
}
export function SelectLoading(props: ParentProps<{ class?: string }>) {
  return <div class={cn(selectLoadingClassName, props.class)}>{props.children ?? 'Loading...'}</div>
}
export { useSelect } from './select-context'
export type { SelectFilterOption, SelectMode, SelectOption, SelectVirtualOptions }
