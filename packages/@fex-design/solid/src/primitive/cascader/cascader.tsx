import { createCascaderController } from '@fex-design/core/cascader/create-cascader-controller'
import type { CascaderChangeMeta, CascaderFieldNames, CascaderFilterOption, CascaderNode, CascaderOption, CascaderValue } from '@fex-design/core/cascader/types'
import { cascaderClearClassName, cascaderColumnClassName, cascaderColumnViewportClassName, cascaderContentClassName, cascaderEmptyClassName, cascaderIndicatorClassName, cascaderInputClassName, cascaderLoadingClassName, cascaderOptionClassName, cascaderOptionIconClassName, cascaderOptionLabelClassName, cascaderPanelClassName, cascaderPanelHeight, cascaderPlaceholderClassName, cascaderSuffixClassName, cascaderTriggerClassName, cascaderValueClassName, cascaderValueContainerClassName } from '@fex-design/styles/cascader'
import { checkboxCheckIconClassName, checkboxClassName, checkboxIndicatorClassName, checkboxMinusIconClassName } from '@fex-design/styles/checkbox'
import { cn } from '@fex/utils'
import { createContext, createMemo, For, Show, splitProps, useContext, type JSX, type ParentProps } from 'solid-js'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'
import { CheckIcon } from '../../icon/check'
import { ChevronDownIcon, ChevronRightIcon } from '../../icon/chevron'
import { CloseIcon } from '../../icon/close'
import { LoadingIcon } from '../../icon/loading'
import { MinusIcon } from '../../icon/minus'
import { Button } from '../button/button'
import { CheckboxIndicator, CheckboxRoot } from '../checkbox/checkbox'
import { Popover, PopoverContent, PopoverPortal, PopoverTrigger } from '../popover/popover'
import { ScrollbarBar, ScrollbarRoot, ScrollbarViewport } from '../scrollbar/scrollbar'
import { Tag } from '../tag/tag'

interface ContextValue {
  controller: ReturnType<typeof createCascaderController>; snapshot: ReturnType<typeof createCoreStoreSignal>; selectedPaths: () => readonly (readonly CascaderNode[])[]
  multiple: () => boolean; expandTrigger: () => 'click' | 'hover'; showSearch: () => boolean; clearable: () => boolean; disabled: () => boolean; loading: () => boolean
  status: () => 'error' | 'warning' | undefined; placeholder: () => string | undefined; displayRender: CascaderRootProps['displayRender']
}
const CascaderContext = createContext<ContextValue>()
function useCascader(part: string) { const value = useContext(CascaderContext); if (!value) throw new Error(`${part} must be used inside CascaderRoot.`); return value }

export interface CascaderRootProps extends ParentProps {
  options?: readonly CascaderOption[]; fieldNames?: CascaderFieldNames; value?: CascaderValue; defaultValue?: CascaderValue
  onChange?: (value: CascaderValue, meta: CascaderChangeMeta) => void; multiple?: boolean; checkStrictly?: boolean; changeOnSelect?: boolean
  open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; expandTrigger?: 'click' | 'hover'; showSearch?: boolean
  filterOption?: boolean | CascaderFilterOption; onSearch?: (keyword: string) => void; loadData?: (path: readonly CascaderOption[]) => Promise<void>
  clearable?: boolean; loading?: boolean; disabled?: boolean; placeholder?: string; status?: 'error' | 'warning'
  displayRender?: (labels: readonly string[], path: readonly CascaderOption[]) => JSX.Element
}
export function CascaderRoot(props: CascaderRootProps) {
  const controller = createCascaderController({
    get options() { return props.options }, get fieldNames() { return props.fieldNames }, get value() { return props.value }, get defaultValue() { return props.defaultValue },
    get multiple() { return props.multiple }, get checkStrictly() { return props.checkStrictly }, get changeOnSelect() { return props.changeOnSelect },
    get open() { return props.open }, get defaultOpen() { return props.defaultOpen }, get expandTrigger() { return props.expandTrigger }, get filterOption() { return props.filterOption },
    onChange: (value, meta) => props.onChange?.(value, meta), onOpenChange: (open) => props.onOpenChange?.(open), onSearch: (value) => props.onSearch?.(value),
    get loadData() { return props.loadData },
  })
  const snapshot = createCoreStoreSignal(controller)
  const selectedPaths = createMemo(() => { snapshot(); return controller.getSelectedPaths() })
  const context: ContextValue = { controller, snapshot, selectedPaths, multiple: () => props.multiple === true, expandTrigger: () => props.expandTrigger ?? 'click', showSearch: () => props.showSearch === true, clearable: () => props.clearable === true, disabled: () => props.disabled === true, loading: () => props.loading === true, status: () => props.status, placeholder: () => props.placeholder, displayRender: props.displayRender }
  return <CascaderContext.Provider value={context}><Popover align="start" open={snapshot().open} defaultOpen={props.defaultOpen ?? false} disabled={props.disabled} onOpenChange={(open) => open ? controller.open() : controller.close()}>{props.children}</Popover></CascaderContext.Provider>
}

export function CascaderTrigger(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  const [local, rest] = splitProps(props, ['class', 'children', 'onKeyDown'])
  const cascader = useCascader('CascaderTrigger')
  const keydown = (event: KeyboardEvent) => {
    if (typeof local.onKeyDown === 'function') local.onKeyDown(event as never)
    if (event.defaultPrevented) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') cascader.controller.moveActive(event.key === 'ArrowDown' ? 1 : -1)
    else if (event.key === 'ArrowRight') cascader.controller.moveToChild(); else if (event.key === 'ArrowLeft') cascader.controller.moveToParent()
    else if (event.key === 'Home' || event.key === 'End') cascader.controller.moveToBoundary(event.key === 'Home' ? 'first' : 'last')
    else if (event.key === 'Enter' || event.key === ' ') cascader.controller.selectActive(); else if (event.key === 'Escape') cascader.controller.close(); else return
    event.preventDefault(); cascader.controller.open()
  }
  return <PopoverTrigger>{(trigger) => <div {...rest} {...(trigger.props as JSX.HTMLAttributes<HTMLDivElement>)} ref={trigger.ref as never} role={undefined} data-disabled={cascader.disabled() || undefined} data-status={cascader.status()} class={cn(cascaderTriggerClassName(), local.class)} onKeyDown={keydown}><div class={cascaderValueContainerClassName}>{local.children ?? <CascaderValue />}<input role="combobox" aria-expanded={cascader.snapshot().open} disabled={cascader.disabled()} readOnly={!cascader.showSearch()} value={cascader.snapshot().searchValue} placeholder={cascader.showSearch() && !cascader.selectedPaths().length ? cascader.placeholder() : undefined} class={cascaderInputClassName} onFocus={() => { if (!cascader.showSearch()) cascader.controller.open() }} onClick={(event) => event.stopPropagation()} onInput={(event) => { const keyword=event.currentTarget.value;cascader.controller.setSearchValue(keyword);keyword.trim()?cascader.controller.open():cascader.controller.close() }} /></div><span class={cascaderSuffixClassName}><Show when={!cascader.loading()} fallback={<LoadingIcon class="animate-spin" />}><Show when={cascader.clearable() && cascader.selectedPaths().length} fallback={<span data-state={cascader.snapshot().open ? 'open' : 'closed'} class={cascaderIndicatorClassName}><ChevronDownIcon /></span>}><Button class={cascaderClearClassName} onClick={(event) => { event.stopPropagation(); cascader.controller.clear() }}><CloseIcon /></Button></Show></Show></span></div>}</PopoverTrigger>
}

export function CascaderValue() {
  const cascader = useCascader('CascaderValue')
  const display = (path: readonly CascaderNode[]) => cascader.displayRender?.(path.map((node) => node.label), path.map((node) => node.option)) ?? path.map((node) => node.label).join(' / ')
  return <Show when={cascader.selectedPaths().length} fallback={<Show when={!cascader.snapshot().searchValue && !cascader.showSearch()}><span class={cascaderPlaceholderClassName}>{cascader.placeholder()}</span></Show>}><Show when={cascader.multiple()} fallback={<div class={cascaderValueClassName}>{display(cascader.selectedPaths()[0]!)}</div>}><For each={cascader.selectedPaths()}>{(path) => <Tag size="sm" closable onClose={(event) => { event.stopPropagation(); cascader.controller.removePath(path.at(-1)!.key) }}>{display(path)}</Tag>}</For></Show></Show>
}

export function CascaderContent(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return <PopoverPortal><PopoverContent {...rest} class={cn(cascaderContentClassName, local.class)}>{local.children ?? <CascaderPanel />}</PopoverContent></PopoverPortal>
}

export function CascaderOption(props: { node: CascaderNode; label?: string }) {
  const cascader = useCascader('CascaderOption')
  const state = () => ({ active: cascader.snapshot().activePath.includes(props.node.key), selected: cascader.snapshot().selectedPathKeys.includes(props.node.key), checked: cascader.snapshot().checkedKeys.includes(props.node.key), indeterminate: cascader.snapshot().indeterminateKeys.includes(props.node.key), loading: cascader.snapshot().loadingKeys.includes(props.node.key) })
  return <div role="option" aria-selected={state().selected} aria-disabled={props.node.disabled || undefined} data-active={state().active || undefined} data-selected={state().selected || undefined} data-disabled={props.node.disabled || undefined} class={cascaderOptionClassName} onPointerEnter={() => { if (cascader.expandTrigger() === 'hover' && !props.node.leaf) cascader.controller.expand(props.node.key) }} onClick={() => cascader.controller.select(props.node.key)}><Show when={cascader.multiple()}><CheckboxRoot checked={state().indeterminate ? 'indeterminate' : state().checked} disabled={props.node.disabled} class={checkboxClassName()} onClick={(event) => { event.stopPropagation(); cascader.controller.toggleCheck(props.node.key) }}><CheckboxIndicator class={checkboxIndicatorClassName}><CheckIcon class={checkboxCheckIconClassName} /><MinusIcon class={checkboxMinusIconClassName} /></CheckboxIndicator></CheckboxRoot></Show><span class={cascaderOptionLabelClassName}>{props.label ?? props.node.label}</span><span class={cascaderOptionIconClassName}><Show when={!state().loading} fallback={<LoadingIcon class="animate-spin" />}><Show when={!props.node.leaf} fallback={<Show when={state().selected}><CheckIcon /></Show>}><ChevronRightIcon /></Show></Show></span></div>
}

export function CascaderPanel() {
  const cascader = useCascader('CascaderPanel')
  const results = () => { cascader.snapshot(); return cascader.controller.getSearchResults() }
  const columns = () => { cascader.snapshot(); return cascader.controller.getColumns() }
  const itemCount = () => cascader.snapshot().searchValue && cascader.showSearch() ? (cascader.loading() ? 0 : results().length) : Math.max(0, ...columns().map(column => column.nodes.length))
  const columnCount = () => cascader.snapshot().searchValue && cascader.showSearch() ? 1 : Math.max(1, columns().length)
  return <div class={cascaderPanelClassName} style={{ '--cascader-column-count': columnCount(), '--cascader-panel-height': cascaderPanelHeight(itemCount()) }}><Show when={cascader.snapshot().searchValue && cascader.showSearch()} fallback={<For each={columns()}>{(column, index) => <CascaderColumn aria-label={`Level ${index() + 1}`}><For each={column.nodes}>{(node) => <CascaderOption node={node} />}</For></CascaderColumn>}</For>}><CascaderColumn class="w-full min-w-full border-r-0"><Show when={!cascader.loading()} fallback={<CascaderLoading />}><Show when={results().length} fallback={<CascaderEmpty />}><For each={results()}>{(path) => <CascaderOption node={path.at(-1)!} label={path.map((node) => node.label).join(' / ')} />}</For></Show></Show></CascaderColumn></Show></div>
}

export function CascaderColumn(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return <div {...rest} role="listbox" class={cn(cascaderColumnClassName, local.class)}><ScrollbarRoot class="h-full"><ScrollbarViewport overflowX="hidden" overflowY="auto" class={cascaderColumnViewportClassName}>{local.children}</ScrollbarViewport><ScrollbarBar axis="y" /></ScrollbarRoot></div>
}

export function CascaderEmpty(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return <div {...rest} class={cn(cascaderEmptyClassName, local.class)}>{local.children ?? 'No options'}</div>
}

export function CascaderLoading(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return <div {...rest} class={cn(cascaderLoadingClassName, local.class)}><LoadingIcon class="animate-spin" />{local.children ?? 'Loading...'}</div>
}
