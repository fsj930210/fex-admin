import {
  cascaderClearClassName,
  cascaderIndicatorClassName,
  cascaderInputClassName,
  cascaderPlaceholderClassName,
  cascaderSuffixClassName,
  cascaderTriggerClassName,
  cascaderValueClassName,
  cascaderValueContainerClassName,
} from '@fex-design/styles/cascader'
import { cn } from '@fex/utils'
import { type ComponentProps, type KeyboardEvent, type ReactNode } from 'react'
import { ChevronDownIcon } from '../../icon/chevron'
import { CloseIcon } from '../../icon/close'
import { LoadingIcon } from '../../icon/loading'
import { InputClearButton } from '../input/input'
import { PopoverTrigger } from '../popover/popover'
import { Tag } from '../tag/tag'
import { useCascader } from './cascader-context'

export interface CascaderTriggerProps extends Omit<ComponentProps<'div'>, 'children'> { children?: ReactNode }

export function CascaderTrigger({ children, className, onKeyDown, ...props }: CascaderTriggerProps) {
  const cascader = useCascader()
  const hasValue = cascader.selectedPaths.length > 0
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const actions = cascader.controller
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') actions.moveActive(event.key === 'ArrowDown' ? 1 : -1)
    else if (event.key === 'ArrowRight') actions.moveToChild()
    else if (event.key === 'ArrowLeft') actions.moveToParent()
    else if (event.key === 'Home' || event.key === 'End') actions.moveToBoundary(event.key === 'Home' ? 'first' : 'last')
    else if (event.key === 'Enter' || event.key === ' ') actions.selectActive()
    else if (event.key === 'Escape') actions.close()
    else return
    event.preventDefault()
    actions.open()
  }
  return (
    <PopoverTrigger>
      {(triggerProps) => <div
        {...props}
        {...(triggerProps as ComponentProps<'div'>)}
        role={undefined}
        data-slot="cascader-trigger"
        data-disabled={cascader.disabled ? 'true' : undefined}
        data-status={cascader.status}
        aria-invalid={cascader.status === 'error' || undefined}
        className={cn(cascaderTriggerClassName(), className)}
        onKeyDown={handleKeyDown}
      >
        <div className={cascaderValueContainerClassName}>
          {children ?? <CascaderValue />}
          <input
            role="combobox"
            aria-expanded={cascader.snapshot.open}
            disabled={cascader.disabled}
            readOnly={!cascader.showSearch}
            value={cascader.snapshot.searchValue}
            placeholder={cascader.showSearch && !hasValue ? cascader.placeholder : undefined}
            className={cascaderInputClassName}
            onFocus={() => { if (!cascader.showSearch) cascader.controller.open() }}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => { const keyword = event.currentTarget.value; cascader.controller.setSearchValue(keyword); keyword.trim() ? cascader.controller.open() : cascader.controller.close() }}
          />
        </div>
        <span className={cascaderSuffixClassName}>
          {cascader.loading ? <LoadingIcon className="animate-spin" /> : cascader.clearable && hasValue ? (
            <InputClearButton className={cascaderClearClassName} aria-label="Clear selection" onClick={(event) => { event.stopPropagation(); cascader.controller.clear() }}><CloseIcon /></InputClearButton>
          ) : <span data-state={cascader.snapshot.open ? 'open' : 'closed'} className={cascaderIndicatorClassName}><ChevronDownIcon /></span>}
        </span>
      </div>}
    </PopoverTrigger>
  )
}

export function CascaderValue({ className, ...props }: ComponentProps<'div'>) {
  const cascader = useCascader()
  if (!cascader.selectedPaths.length) return cascader.snapshot.searchValue || cascader.showSearch ? null : <span className={cascaderPlaceholderClassName}>{cascader.placeholder}</span>
  const render = (path: (typeof cascader.selectedPaths)[number]) => cascader.displayRender?.(path.map((node) => node.label), path.map((node) => node.option)) ?? path.map((node) => node.label).join(' / ')
  if (!cascader.multiple) return <div {...props} className={cn(cascaderValueClassName, className)}>{render(cascader.selectedPaths[0]!)}</div>
  return <div {...props} className={cn('contents', className)}>{cascader.selectedPaths.map((path) => <Tag key={path.at(-1)!.key} size="sm" closable onClose={(event) => { event.stopPropagation(); cascader.controller.removePath(path.at(-1)!.key) }}>{render(path)}</Tag>)}</div>
}
