import {
  timePickerColumnClassName,
  timePickerColumnItemClassName,
  timePickerColumnSpacerClassName,
  timePickerColumnViewportClassName,
} from '@fex/components-styles/time-picker'
import type { TimePeriod, TimePickerOption } from '@fex/components-core/time-picker/types'
import { cn } from '@fex/utils'
import {
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'
import { useComposedRef } from '../../hooks/use-composed-ref'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { useTimePickerContext } from './time-picker-context'
import { ScrollbarBar, ScrollbarRoot, ScrollbarViewport } from '../scrollbar/scrollbar'

type ColumnValue = number | TimePeriod

export interface TimePickerColumnItemRenderState<TValue extends ColumnValue> {
  item: TimePickerOption<TValue>
  selected: boolean
  active: boolean
  itemProps: ComponentProps<'button'> & {
    ref: Ref<HTMLButtonElement>
    'data-selected'?: string | undefined
    'data-active'?: string | undefined
    'data-disabled'?: string | undefined
  }
}

interface TimePickerColumnProps<TValue extends ColumnValue> extends Omit<
  ComponentProps<'div'>,
  'children' | 'onSelect'
> {
  options: readonly TimePickerOption<TValue>[]
  selectedValue: TValue | undefined
  disabled?: boolean
  onSelect(value: TValue): void
  children?: ((state: TimePickerColumnItemRenderState<TValue>) => ReactElement | null) | ReactNode
}

export function TimePickerColumn<TValue extends ColumnValue>({
  options,
  selectedValue,
  disabled = false,
  onSelect,
  children,
  className,
  onKeyDown,
  ref,
  ...props
}: TimePickerColumnProps<TValue>) {
  const { snapshot, disabled: rootDisabled, readOnly } = useTimePickerContext('TimePickerColumn')
  const listRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef(new Map<ColumnValue, HTMLButtonElement>())
  const activeValueRef = useRef<TValue | undefined>(selectedValue)
  const [activeValue, setActiveValue] = useState<TValue | undefined>(selectedValue)
  const resolvedDisabled = rootDisabled || disabled
  const composedRef = useComposedRef<HTMLDivElement>(listRef, ref)

  function scrollSelected(behavior: ScrollBehavior) {
    if (selectedValue === undefined) return
    const list = listRef.current
    const item = itemRefs.current.get(selectedValue)
    if (!list || !item) return
    list.scrollTo({ top: item.offsetTop, behavior })
  }

  // DOM scrolling is an external system. Layout timing ensures items exist before
  // the selected value is aligned without feeding scrollTop back into component state.
  useIsomorphicLayoutEffect(() => {
    scrollSelected(snapshot.scrollRequest?.behavior ?? 'auto')
  }, [selectedValue, snapshot.scrollRequest?.id])

  function moveActive(direction: 1 | -1) {
    const enabled = options.filter((option) => !option.disabled)
    if (enabled.length === 0) return
    const currentIndex = enabled.findIndex((option) => option.value === activeValueRef.current)
    const nextIndex = Math.min(enabled.length - 1, Math.max(0, currentIndex + direction))
    const next = enabled[nextIndex]
    if (!next) return
    activeValueRef.current = next.value
    setActiveValue(next.value)
    itemRefs.current.get(next.value)?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event)
    if (event.defaultPrevented || resolvedDisabled || readOnly) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      moveActive(event.key === 'ArrowDown' ? 1 : -1)
    }
  }

  return (
    <ScrollbarRoot
      data-slot="time-picker-column"
      data-disabled={resolvedDisabled ? 'true' : undefined}
      className={cn(timePickerColumnClassName, className)}
      disabled={resolvedDisabled}
    >
      <ScrollbarViewport
        {...props}
        ref={composedRef}
        role="listbox"
        tabIndex={resolvedDisabled ? -1 : 0}
        aria-disabled={resolvedDisabled || undefined}
        className={timePickerColumnViewportClassName}
        overflow={{ x: 'hidden', y: 'auto' }}
        onKeyDown={handleKeyDown}
      >
      {options.map((item) => {
        const selected = Object.is(item.value, selectedValue)
        const itemProps: TimePickerColumnItemRenderState<TValue>['itemProps'] = {
          ref: (element) => {
            if (element) itemRefs.current.set(item.value, element)
            else itemRefs.current.delete(item.value)
          },
          type: 'button',
          role: 'option',
          tabIndex: -1,
          disabled: resolvedDisabled || item.disabled,
          'aria-selected': selected,
          'data-selected': selected ? 'true' : undefined,
          'data-disabled': item.disabled ? 'true' : undefined,
          'data-active': Object.is(activeValue, item.value) ? 'true' : undefined,
          onFocus: () => {
            activeValueRef.current = item.value
            setActiveValue(item.value)
          },
          onClick: () => {
            if (resolvedDisabled || readOnly || item.disabled) return
            activeValueRef.current = item.value
            setActiveValue(item.value)
            onSelect(item.value)
            const itemElement = itemRefs.current.get(item.value)
            if (listRef.current && itemElement) {
              listRef.current.scrollTo({ top: itemElement.offsetTop, behavior: 'smooth' })
            }
          },
        }
        const state = { item, selected, active: Object.is(activeValue, item.value), itemProps }
        return typeof children === 'function' ? (
          children(state)
        ) : (
          <TimePickerColumnItem key={String(item.value)} {...itemProps}>
            {item.label}
          </TimePickerColumnItem>
        )
      })}
      <div aria-hidden="true" className={timePickerColumnSpacerClassName} />
      </ScrollbarViewport>
      <ScrollbarBar axis="y" />
    </ScrollbarRoot>
  )
}

export interface TimePickerColumnItemProps extends ComponentProps<'button'> {
  ref?: Ref<HTMLButtonElement>
}

export function TimePickerColumnItem({ className, ref, ...props }: TimePickerColumnItemProps) {
  return <button {...props} ref={ref} className={cn(timePickerColumnItemClassName, className)} />
}
