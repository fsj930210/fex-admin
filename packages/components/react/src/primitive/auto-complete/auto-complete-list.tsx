import {
  autoCompleteListClassName,
  autoCompleteOptionClassName,
} from '@fex/components-styles/auto-complete'
import { cn } from '@fex/utils'
import { type ComponentProps, type ReactNode } from 'react'
import { useAutoComplete, useAutoCompleteOption } from './use-auto-complete'

export interface AutoCompleteListProps extends ComponentProps<'div'> {
  renderItem?: (item: unknown, state: { active: boolean; disabled: boolean }) => ReactNode
}

export function AutoCompleteList({
  className,
  children,
  renderItem,
  ...props
}: AutoCompleteListProps) {
  const autoComplete = useAutoComplete()
  return (
    <div
      {...props}
      id={autoComplete.listId}
      role="listbox"
      className={cn(autoCompleteListClassName, className)}
    >
      {children ??
        autoComplete.items.map((entry) => (
          <AutoCompleteOption key={entry.key} itemKey={entry.key}>
            {renderItem?.(entry.item, {
              active: autoComplete.snapshot.activeKey === entry.key,
              disabled: entry.disabled,
            }) ?? entry.label}
          </AutoCompleteOption>
        ))}
    </div>
  )
}

export interface AutoCompleteOptionProps extends ComponentProps<'div'> {
  itemKey: string | number
}

export function AutoCompleteOption({
  itemKey,
  className,
  onPointerMove,
  onPointerDown,
  onClick,
  ...props
}: AutoCompleteOptionProps) {
  const autoComplete = useAutoComplete()
  const state = useAutoCompleteOption(itemKey)
  return (
    <div
      {...props}
      id={`${autoComplete.listId}-${itemKey}`}
      role="option"
      aria-selected={state.active}
      aria-disabled={state.disabled || undefined}
      data-active={state.active ? 'true' : undefined}
      data-disabled={state.disabled ? 'true' : undefined}
      className={cn(autoCompleteOptionClassName, className)}
      onPointerMove={(event) => {
        onPointerMove?.(event)
        if (!event.defaultPrevented) state.activate()
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        if (!event.defaultPrevented) event.preventDefault()
      }}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) state.select()
      }}
    />
  )
}
