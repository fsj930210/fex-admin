import {
  autoCompleteContentClassName,
  autoCompleteListClassName,
  autoCompleteOptionClassName,
} from '@fex-design/styles/auto-complete'
import { cn } from '@fex/utils'
import { For, Show, splitProps, type JSX, type ParentProps } from 'solid-js'
import { Empty, EmptyDescription } from '../empty/empty'
import { PopoverContent, PopoverPortal } from '../popover/popover'
import { Spinner } from '../../ui/spinner/spinner'
import { useAutoComplete } from './context'

export function AutoCompleteContent(
  props: ParentProps<{ class?: string; style?: JSX.CSSProperties }>,
) {
  const [local] = splitProps(props, ['children', 'class', 'style'])
  return (
    <PopoverPortal>
      <PopoverContent
        class={cn(autoCompleteContentClassName, local.class)}
        style={`width:var(--auto-complete-content-width,var(--floating-reference-width));max-width:var(--auto-complete-content-width,var(--floating-reference-width));${typeof local.style === 'string' ? local.style : ''}`}
      >
        {local.children ?? <AutoCompleteList />}
      </PopoverContent>
    </PopoverPortal>
  )
}
export interface AutoCompleteListProps extends ParentProps<JSX.HTMLAttributes<HTMLDivElement>> {
  item?: (
    item: Record<string, unknown>,
    state: { active: boolean; disabled: boolean },
  ) => JSX.Element
}
export function AutoCompleteList(props: AutoCompleteListProps) {
  const autoComplete = useAutoComplete('AutoCompleteList')
  const [local, rest] = splitProps(props, ['children', 'class', 'item'])
  return (
    <div
      {...rest}
      id={autoComplete.listId}
      role="listbox"
      class={cn(autoCompleteListClassName, local.class)}
    >
      <Show
        when={!autoComplete.loading()}
        fallback={
          <div class="flex min-h-20 items-center justify-center">
            <Spinner />
          </div>
        }
      >
        <Show
          when={autoComplete.items().length}
          fallback={
            <Empty>
              <EmptyDescription>No suggestions</EmptyDescription>
            </Empty>
          }
        >
          {local.children ?? (
            <For each={autoComplete.items()}>
              {(entry) => (
                <AutoCompleteOption itemKey={entry.key}>
                  {local.item?.(entry.item, {
                    active: autoComplete.snapshot().activeKey === entry.key,
                    disabled: entry.disabled,
                  }) ?? entry.label}
                </AutoCompleteOption>
              )}
            </For>
          )}
        </Show>
      </Show>
    </div>
  )
}
export function AutoCompleteOption(
  props: ParentProps<JSX.HTMLAttributes<HTMLDivElement> & { itemKey: string | number }>,
) {
  const autoComplete = useAutoComplete('AutoCompleteOption')
  const [local, rest] = splitProps(props, [
    'itemKey',
    'children',
    'class',
    'onPointerMove',
    'onPointerDown',
    'onClick',
  ])
  const entry = () => autoComplete.items().find((item) => item.key === local.itemKey)
  const active = () => autoComplete.snapshot().activeKey === local.itemKey
  return (
    <div
      {...rest}
      id={`${autoComplete.listId}-${local.itemKey}`}
      role="option"
      aria-selected={active()}
      aria-disabled={entry()?.disabled || undefined}
      data-active={active() || undefined}
      data-disabled={entry()?.disabled || undefined}
      class={cn(autoCompleteOptionClassName, local.class)}
      onPointerMove={() => autoComplete.controller.setActiveKey(local.itemKey, 'pointer')}
      onPointerDown={(event) => event.preventDefault()}
      onClick={() => autoComplete.controller.selectItem(local.itemKey)}
    >
      {local.children}
    </div>
  )
}
