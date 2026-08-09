import type { CascaderNode } from '@fex-design/core/cascader/types'
import {
  cascaderColumnClassName,
  cascaderColumnViewportClassName,
  cascaderContentClassName,
  cascaderEmptyClassName,
  cascaderLoadingClassName,
  cascaderOptionClassName,
  cascaderOptionIconClassName,
  cascaderOptionLabelClassName,
  cascaderPanelHeight,
  cascaderPanelClassName,
} from '@fex-design/styles/cascader'
import { checkboxCheckIconClassName, checkboxClassName, checkboxIndicatorClassName, checkboxMinusIconClassName } from '@fex-design/styles/checkbox'
import { cn } from '@fex/utils'
import { type ComponentProps, type CSSProperties, type ReactNode } from 'react'
import { CheckIcon } from '../../icon/check'
import { ChevronRightIcon } from '../../icon/chevron'
import { LoadingIcon } from '../../icon/loading'
import { MinusIcon } from '../../icon/minus'
import { CheckboxIndicator, CheckboxRoot } from '../checkbox/checkbox'
import { PopoverContent, PopoverPortal } from '../popover/popover'
import { ScrollbarBar, ScrollbarRoot, ScrollbarViewport } from '../scrollbar/scrollbar'
import { useCascader } from './cascader-context'

export function CascaderContent({ className, children, ...props }: ComponentProps<'div'>) {
  return <PopoverPortal><PopoverContent {...props} role={undefined} className={cn(cascaderContentClassName, className)}>{children ?? <CascaderPanel />}</PopoverContent></PopoverPortal>
}

export interface CascaderPanelProps extends ComponentProps<'div'> {
  optionRender?: (node: CascaderNode, state: CascaderOptionState) => ReactNode
  empty?: ReactNode
}

export function CascaderPanel({ className, optionRender, empty, style, ...props }: CascaderPanelProps) {
  const cascader = useCascader()
  const searchResults = cascader.controller.getSearchResults()
  if (cascader.snapshot.searchValue && cascader.showSearch) {
    return <div {...props} style={{ ...style, '--cascader-column-count': 1, '--cascader-panel-height': cascaderPanelHeight(cascader.loading ? 0 : searchResults.length) } as CSSProperties} className={cn(cascaderPanelClassName, className)}><CascaderColumn className="w-full min-w-full border-r-0">{cascader.loading ? <CascaderLoading /> : searchResults.length ? searchResults.map((path) => <CascaderOption key={path.at(-1)!.key} node={path.at(-1)!} label={path.map((node) => node.label).join(' / ')} render={optionRender} />) : (empty ?? <CascaderEmpty />)}</CascaderColumn></div>
  }
  const columns = cascader.controller.getColumns()
  const itemCount = Math.max(0, ...columns.map((column) => column.nodes.length))
  return <div {...props} role="tree" style={{ ...style, '--cascader-column-count': columns.length, '--cascader-panel-height': cascaderPanelHeight(itemCount) } as CSSProperties} className={cn(cascaderPanelClassName, className)}>{columns.map((column, index) => <CascaderColumn key={column.parentKey ?? 'root'} aria-label={`Level ${index + 1}`}>{column.nodes.map((node) => <CascaderOption key={node.key} node={node} render={optionRender} />)}</CascaderColumn>)}</div>
}

export function CascaderColumn({ className, children, ...props }: ComponentProps<'div'>) {
  return <div {...props} role="listbox" className={cn(cascaderColumnClassName, className)}><ScrollbarRoot className="h-full" overflow={{ y: 'auto', x: 'hidden' }}><ScrollbarViewport className={cascaderColumnViewportClassName}>{children}</ScrollbarViewport><ScrollbarBar axis="y" /></ScrollbarRoot></div>
}

export interface CascaderOptionState {
  active: boolean
  selected: boolean
  checked: boolean
  indeterminate: boolean
  disabled: boolean
  leaf: boolean
  loading: boolean
}

export function CascaderOption({ node, label, render, className, ...props }: Omit<ComponentProps<'div'>, 'children'> & { node: CascaderNode; label?: ReactNode; render?: CascaderPanelProps['optionRender'] }) {
  const cascader = useCascader()
  const state: CascaderOptionState = {
    active: cascader.snapshot.activePath.includes(node.key),
    selected: cascader.snapshot.selectedPathKeys.includes(node.key),
    checked: cascader.snapshot.checkedKeys.includes(node.key),
    indeterminate: cascader.snapshot.indeterminateKeys.includes(node.key),
    disabled: node.disabled,
    leaf: node.leaf,
    loading: cascader.snapshot.loadingKeys.includes(node.key),
  }
  return <div
    {...props}
    role="option"
    aria-selected={state.selected}
    aria-disabled={state.disabled || undefined}
    data-active={state.active ? 'true' : undefined}
    data-selected={state.selected ? 'true' : undefined}
    data-disabled={state.disabled ? 'true' : undefined}
    className={cn(cascaderOptionClassName, className)}
    onPointerEnter={() => { if (cascader.expandTrigger === 'hover' && !node.leaf) cascader.controller.expand(node.key) }}
    onClick={() => cascader.controller.select(node.key)}
  >
    {render?.(node, state) ?? <>
      {cascader.multiple ? <CheckboxRoot checked={state.indeterminate ? 'indeterminate' : state.checked} disabled={state.disabled} className={checkboxClassName()} onClick={(event) => { event.stopPropagation(); cascader.controller.toggleCheck(node.key) }}><CheckboxIndicator className={checkboxIndicatorClassName}><CheckIcon className={checkboxCheckIconClassName} /><MinusIcon className={checkboxMinusIconClassName} /></CheckboxIndicator></CheckboxRoot> : null}
      <span className={cascaderOptionLabelClassName}>{label ?? node.label}</span>
      <span className={cascaderOptionIconClassName}>{state.loading ? <LoadingIcon className="animate-spin" /> : !state.leaf ? <ChevronRightIcon /> : state.selected ? <CheckIcon /> : null}</span>
    </>}
  </div>
}

export function CascaderEmpty({ children = 'No options', className, ...props }: ComponentProps<'div'>) {
  return <div {...props} className={cn(cascaderEmptyClassName, className)}>{children}</div>
}

export function CascaderLoading({ children = 'Loading...', className, ...props }: ComponentProps<'div'>) {
  return <div {...props} className={cn(cascaderLoadingClassName, className)}><LoadingIcon className="animate-spin" />{children}</div>
}
